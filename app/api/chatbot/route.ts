import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getSystemPrompt(channel: string) {
  const whatsappSupport = process.env.WHATSAPP_SUPPORT_NUMBER || "soporte por WhatsApp";
  const isWhatsapp = channel.toLowerCase() === "whatsapp";

  return `Eres el asistente virtual de Trading Academy para atención comercial y orientación inicial.

CONTEXTO VERIFICADO (NO INVENTAR DATOS):
- Academia: método de trading para mercado latino, enfocado en disciplina y gestión de riesgo.
- Cursos:
  1) Básico: $97 USD
  2) Intermedio: $197 USD
  3) Profesional: $497 USD
  4) Membresía VIP: $997 USD/año
- Bots:
  - Starter: $49/mes
  - Pro: $149/mes
  - Enterprise: $399/mes
- Pagos: tarjeta, PayPal, transferencia y cripto (USDT, BTC).
- Garantía: 7 días.
- Riesgo: no se garantizan ganancias.

REGLAS DE RESPUESTA:
1) Responde SIEMPRE en español.
2) No inventes precios, planes, fechas, rentabilidades ni promesas de ganancias.
3) Si falta información exacta, dilo explícitamente y deriva a ${whatsappSupport}.
4) Si preguntan por resultados, recalca riesgo y que depende de disciplina/gestión.
5) Mantén tono profesional, claro y útil.
${isWhatsapp ? "6) Canal WhatsApp: respuestas cortas (3-6 líneas), directas y con CTA final." : "6) Canal web: respuestas concisas pero completas."}
7) Si piden soporte humano, ofrece contacto por ${whatsappSupport}.

OBJETIVO:
Resolver dudas de cursos, bots, pagos, registro y próximos pasos sin alucinar información.`;
}

function sanitizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => {
      if (!item || typeof item !== "object") return false;
      const role = (item as any).role;
      const content = (item as any).content;
      return (role === "user" || role === "assistant") && typeof content === "string";
    })
    .map((item) => ({
      role: (item as any).role,
      content: String((item as any).content).slice(0, 2000),
    }))
    .slice(-10);
}

function createSSETextResponse(text: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], channel = "web" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensaje requerido" },
        { status: 400 }
      );
    }

    const safeMessage = message.trim();
    if (!safeMessage) {
      return NextResponse.json(
        { error: "Mensaje vacío" },
        { status: 400 }
      );
    }

    const safeHistory = sanitizeHistory(conversationHistory);
    const lowerMessage = safeMessage.toLowerCase();

    const isRelatedToTradingAcademy = /(trading|curso|cursos|bot|bots|academy|membres[ií]a|vip|precio|precios|pago|pagos|registro|soporte|whatsapp|forex|cripto|señales)/i.test(
      lowerMessage
    );

    if (!isRelatedToTradingAcademy) {
      return createSSETextResponse(
        "Puedo ayudarte con temas de Trading Academy: cursos, bots, precios, métodos de pago, registro y soporte. Si deseas atención humana, te conecto por WhatsApp."
      );
    }

    if (!process.env.ABACUSAI_API_KEY) {
      return createSSETextResponse(
        "El asistente IA no está configurado todavía (falta ABACUSAI_API_KEY). Mientras tanto, puedo orientarte en cursos, bots y registro, o derivarte a soporte por WhatsApp."
      );
    }

    const messages = [
      { role: "system", content: getSystemPrompt(String(channel)) },
      ...safeHistory,
      { role: "user", content: safeMessage.slice(0, 2000) },
    ];

    const response = await fetch("https://apps.abacus.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        stream: true,
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return createSSETextResponse(
        "Ahora mismo no pude conectar con el servicio de IA. Intenta en unos minutos o te ayudo por soporte humano de inmediato."
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let partialRead = "";

        try {
          while (true) {
            const { done, value } = await (reader?.read() ?? { done: true, value: undefined });
            if (done) break;

            partialRead += decoder.decode(value, { stream: true });
            const lines = partialRead.split("\n");
            partialRead = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
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
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Error al procesar tu mensaje. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
