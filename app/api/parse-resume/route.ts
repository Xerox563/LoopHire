import { NextResponse } from "next/server";
import OpenAI from "openai";

// More robust import for pdf-parse
const pdf = require("pdf-parse");

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
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      console.log("API Key missing");
      return NextResponse.json({ error: "OPENROUTER_API_KEY is missing from environment variables" }, { status: 500 });
    }
    
    if (!key.startsWith("sk-or-v1-")) {
      console.log("API Key format invalid");
      return NextResponse.json({ error: "OPENROUTER_API_KEY format is invalid (should start with sk-or-v1-)" }, { status: 500 });
    }

    console.log("API Key present and formatted correctly");
    let formData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error("Form data error:", e);
      return NextResponse.json({ error: "Failed to parse form data" }, { status: 400 });
    }
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`Received file: ${file.name}, type: ${file.type}`);

    let text = "";
    if (file.type === "application/pdf") {
      console.log("PDF detected, starting extraction...");
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Use a safer way to call pdf-parse
        const data = await pdf(buffer).catch((err: any) => {
          console.error("Internal pdf-parse error:", err);
          throw err;
        });
        
        text = data.text || "";
        console.log(`PDF extracted. Text length: ${text.length}`);
      } catch (pdfError: any) {
        console.error("Detailed PDF Error:", pdfError);
        return NextResponse.json({ 
          error: "PDF extraction failed", 
          details: pdfError?.message || String(pdfError) 
        }, { status: 500 });
      }
    } else {
      console.log("Parsing as text...");
      text = await file.text();
      console.log("Text file parsed successfully, text length:", text.length);
    }

    if (!text) {
      console.log("Empty text extracted");
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    console.log("Calling OpenAI/OpenRouter...");
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
    console.log("AI response received");
    if (!content) {
      throw new Error("Failed to get content from AI");
    }

    // Clean markdown code blocks if present
    const cleanedContent = content.replace(/```json\n?|```/g, "").trim();
    const parsedData = JSON.parse(cleanedContent);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Resume parsing error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to parse resume: ${errorMessage}` },
      { status: 500 }
    );
  }
}
