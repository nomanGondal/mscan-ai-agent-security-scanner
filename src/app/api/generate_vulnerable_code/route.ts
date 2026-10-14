import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt: string = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a security educator. Generate vulnerable Python MCP code examples for security testing and education only. Return only raw Python code, no markdown, no explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const code = completion.choices[0]?.message?.content
      ?.replaceAll(/```(?:\w+)?\n?/g, "")
      ?.replaceAll("```", "")
      ?.trim();

    if (!code) {
      return NextResponse.json({ error: "No code generated" }, { status: 500 });
    }

    return NextResponse.json({ code });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
