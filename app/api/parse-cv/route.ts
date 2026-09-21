import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No CV file uploaded." }, { status: 400 });
    }

    // Convert file to base64 buffer
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "application/pdf";

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini 2.5 Flash with structured JSON output
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        "Extract structured profile information from this CV/Resume.",
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personal: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                headline: { type: Type.STRING },
                location: { type: Type.STRING },
                about: { type: Type.STRING },
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING },
                },
              },
            },
            educations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                },
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  role: { type: Type.STRING },
                  link: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      return NextResponse.json({ error: "No response text generated." }, { status: 500 });
    }

    const parsedData = JSON.parse(outputText);
    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Gemini CV Parsing Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to parse CV." },
      { status: 500 }
    );
  }
}