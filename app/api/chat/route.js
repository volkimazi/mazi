import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { destination, topic, messages } = await request.json();

   const systemPrompt = `
You are MAZI, an AI travel assistant.

Respond in a structured format.

Always organize your answer like this:

Day 1:
- Activity
- Place
- Food

Day 2:
- Activity
- Place
- Food

Day 3:
- Activity
- Place
- Food

Keep it short, clean, and useful.

No long paragraphs.
No storytelling.

Just practical travel plan.

Add emojis where helpful.
`;

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