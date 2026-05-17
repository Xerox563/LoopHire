import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://loophire.os",
    "X-Title": "LoopHire Dashboard",
  },
});

const SYSTEM_PROMPT = `You are a resume parsing assistant. 
Your task is to take a raw resume text and extract it into four specific sections:
1. Experience: Work history, roles, companies, and key achievements.
2. Technical Skills: Programming languages, frameworks, tools, and technical competencies.
3. Education: Degrees, universities, certifications, and academic honors.
4. Projects: Personal or professional projects, your role, and technologies used.

Format the output as a clean, structured JSON object with these four keys: "experience", "technicalSkills", "education", and "projects".
Each value should be a concise, well-formatted string (use newlines for readability if needed).

Respond ONLY with the JSON object.`;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Parse this resume text:\n\n${text}` },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Failed to get content from AI");
    }

    const parsedData = JSON.parse(content);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Resume parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
