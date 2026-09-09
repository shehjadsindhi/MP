import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const clients = new Map<string, { userId: string; controller: ReadableStreamDefaultController }[]>();

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    if (!clients.has(userId)) {
      clients.set(userId, []);
    }

    const stream = new ReadableStream({
      start(controller) {
        const clientEntry = { userId, controller };
        clients.get(userId)!.push(clientEntry);

        controller.enqueue(`data: ${JSON.stringify({ type: "connected", message: "Real-time notifications active" })}\n\n`);

        req.signal.addEventListener("abort", () => {
          const userClients = clients.get(userId) || [];
          const index = userClients.findIndex((c) => c.controller === controller);
          if (index >= 0) {
            userClients.splice(index, 1);
          }
          if (userClients.length === 0) {
            clients.delete(userId);
          }
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to notifications" }, { status: 500 });
  }
}
