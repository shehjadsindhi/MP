const clients = new Map<string, { userId: string; controller: ReadableStreamDefaultController }[]>();

export async function broadcastToUser(userId: string, event: { type: string; data: any }) {
  const userClients = clients.get(userId) || [];
  const message = `data: ${JSON.stringify(event)}\n\n`;

  for (const client of userClients) {
    try {
      client.controller.enqueue(new TextEncoder().encode(message));
    } catch (e) {
      console.warn("Failed to send notification to client:", e);
    }
  }
}

export async function broadcastOrderUpdate(userId: string, orderId: string, status: string) {
  await broadcastToUser(userId, {
    type: "order_update",
    data: { orderId, status, timestamp: new Date().toISOString() },
  });
}

export async function broadcastAICompletion(userId: string, taskId: string, result: any) {
  await broadcastToUser(userId, {
    type: "ai_completion",
    data: { taskId, result, timestamp: new Date().toISOString() },
  });
}
