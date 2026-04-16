import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { destination, topic, messages } = await request.json();

    const systemPrompt = `You are MAZI, an expert travel guide AI. 
The user is asking about ${destination}.
Focus on: ${topic || "general travel information"}.
Be helpful, specific, and engaging. Keep responses concise (3-4 paragraphs max).
Always end with one practical tip.`;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages || [
        {
          role: "user",
          content: `Tell me about ${topic} in ${destination}`,
        },
      ],
    });

    return Response.json({
      message: response.content[0].text,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Failed to get response" }, { status: 500 });
  }
}