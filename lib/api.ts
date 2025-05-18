// filepath: d:\last-semester\gradution-project\chat-interface\v0-modern-chat\lib\api.ts
export async function askQuestion(projectId: string, text: string, limit: number = 5) {
  const response = await fetch(`/api/v1/rag/ask/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, limit }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.signal || "API Error");
  }

  return response.json();
}