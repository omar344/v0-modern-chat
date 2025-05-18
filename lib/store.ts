import { create } from "zustand"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

export type MessageRole = "user" | "assistant" | "system"

export interface Message {
  id: string
  content: string
  role: MessageRole
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  projectId: string | null
  isLoading: boolean
  isSidebarOpen: boolean
  isDarkMode: boolean
  error: string | null

  // Actions
  addMessage: (content: string, role: MessageRole) => void
  updateLastMessage: (content: string) => void
  setProjectId: (id: string) => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  setError: (error: string | null) => void
  clearMessages: () => void
  initializeProject: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  uploadFile: (file: File) => Promise<void>
  initializeSidebarState: () => void
}

// Determine if we're in a secure context (HTTPS)
const isSecureContext = typeof window !== "undefined" && window.location.protocol === "https:"

// Adjust the API base URL based on the context
const API_BASE_URL = isSecureContext
  ? "https://192.168.1.177:5000/api/v1/rag" // Use HTTPS in secure contexts
  : "http://192.168.1.177:5000/api/v1/rag" // Use HTTP otherwise

// Add a warning message about mixed content if we're in a secure context
if (isSecureContext && API_BASE_URL.startsWith("http:")) {
  console.warn(
    "Warning: Attempting to access an insecure API endpoint from a secure context. This may be blocked by the browser.",
  )
}

export const useStore = create<ChatState>((set, get) => ({
  messages: [],
  projectId: null,
  isLoading: false,
  isSidebarOpen: true, // Default to true, but will be initialized based on screen size
  isDarkMode: true,
  error: null,

  addMessage: (content, role) => {
    const newMessage = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  updateLastMessage: (content) => {
    set((state) => {
      const messages = [...state.messages]
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        messages[messages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        }
      }
      return { messages }
    })
  },

  setProjectId: (id) => set({ projectId: id }),

  setLoading: (loading) => set({ isLoading: loading }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [] }),

  // Initialize sidebar state based on screen size
  initializeSidebarState: () => {
    const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false
    set({ isSidebarOpen: !isMobile }) // Open on desktop, closed on mobile
  },

  initializeProject: async () => {
    try {
      set({ isLoading: true, error: null })
      // In a real implementation, you would get a project ID from your backend
      // For now, we'll generate a UUID on the client side
      const newProjectId = uuidv4()
      set({
        projectId: newProjectId,
        messages: [],
        isLoading: false,
      })
      return Promise.resolve()
    } catch (error) {
      set({
        error: "Failed to initialize project",
        isLoading: false,
      })
      return Promise.reject(error)
    }
  },

  sendMessage: async (content) => {
    const { projectId, addMessage, updateLastMessage } = get()

    if (!projectId) {
      set({ error: "No active project" })
      return Promise.reject("No active project")
    }

    try {
      set({ isLoading: true, error: null })

      // Add user message to the chat
      addMessage(content, "user")

      // Add an empty assistant message that will be updated
      addMessage("", "assistant")

      const response = await fetch(`${API_BASE_URL}/ask/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content, limit: 5 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.signal || "API Error")
      }

      const data = await response.json()
      // Only show the answer to the user
      updateLastMessage(data.answer || "")

      set({ isLoading: false })
    } catch (error: any) {
      set({
        error: error.message || "Failed to send message",
        isLoading: false,
      })
    }
  },

  uploadFile: async (file) => {
    const { setProjectId, addMessage } = get();

    try {
      set({ isLoading: true, error: null });

      const formData = new FormData();
      formData.append("file", file);

      // POST to the upload endpoint
      const response = await axios.post(`${API_BASE_URL}/upload_file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isLoading: false });

      // Extract project_id from the response
      const { project_id } = response.data;
      if (project_id) {
        setProjectId(project_id);
        addMessage(`File "${file.name}" uploaded successfully. Project ID set.`, "system");
      } else {
        addMessage(`File "${file.name}" uploaded, but no project ID returned.`, "system");
      }

      return Promise.resolve();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to upload file";
      set({
        error: errorMessage,
        isLoading: false,
      });

      addMessage(`Failed to upload file: ${errorMessage}`, "system");

      return Promise.reject(error);
    }
  },
}))
