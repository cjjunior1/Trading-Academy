import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ messages: [], sessionId: null });
    }

    const userId = (session.user as any).id;

    // Buscar la sesión más reciente del usuario con mensajes
    const latestSession = await prisma.chatSession.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        lastActiveAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 50, // Limitar a los últimos 50 mensajes
        },
      },
    });

    if (!latestSession || latestSession.messages.length === 0) {
      return NextResponse.json({ messages: [], sessionId: null });
    }

    return NextResponse.json({
      sessionId: latestSession.id,
      messages: latestSession.messages,
    });
  } catch (error) {
    console.error("Error loading chat history:", error);
    return NextResponse.json(
      { error: "Error al cargar el historial" },
      { status: 500 }
    );
  }
}
