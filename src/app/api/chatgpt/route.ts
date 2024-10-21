// app/api/chatgpt/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is correctly set
});

export async function POST(req: Request) {
  try {
    const { question, card } = await req.json();

    const prompt = `
      You are a tarot card reader. A user has asked the following question: "${question}".
      The card drawn is "${card.name}", which is part of the "${
      card.arcana
    }" and represents "${card.keywords.join(", ")}".
      Provide an interpretation of how this card relates to the question.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using GPT-4 turbo
      messages: [
        { role: "system", content: "You are a tarot card reading expert." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });
    // Disable no-explicit-any rule for this line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completionText: any = response.choices[0].message.content;
    return NextResponse.json({ response: completionText.trim() });
  } catch (error) {
    console.error("Error generating ChatGPT response:", error); // Log the error
    return NextResponse.json(
      { error: "Failed to generate response from ChatGPT" },
      { status: 500 }
    );
  }
}
