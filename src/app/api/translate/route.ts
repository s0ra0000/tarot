// app/api/translate/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, target } = await req.json();

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      target: target,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 500 });
  }

  const translatedText = data.data.translations[0].translatedText;
  return NextResponse.json({ translatedText });
}
