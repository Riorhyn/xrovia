import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { GoogleGenAI, Type } from "@google/genai";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not set in environment variables." }, { status: 500 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No CV file uploaded." }, { status: 400 });
    if (file.size === 0) return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "CV files must be 10 MB or smaller." }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Supported CV formats are PDF, JPG, PNG, and WEBP." }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { inlineData: { mimeType: file.type, data: base64Data } },
        "Extract only information explicitly present in this CV/Resume. Do not invent, infer, or improve facts. Return empty strings or empty arrays when information is missing. This is a draft for the user to review before saving.",
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
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experiences: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: {
                company: { type: Type.STRING }, role: { type: Type.STRING }, startDate: { type: Type.STRING },
                endDate: { type: Type.STRING }, current: { type: Type.BOOLEAN }, description: { type: Type.STRING },
              }},
            },
            educations: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: {
                institution: { type: Type.STRING }, degree: { type: Type.STRING }, fieldOfStudy: { type: Type.STRING },
                startDate: { type: Type.STRING }, endDate: { type: Type.STRING }, current: { type: Type.BOOLEAN },
              }},
            },
            projects: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: {
                title: { type: Type.STRING }, role: { type: Type.STRING }, link: { type: Type.STRING }, description: { type: Type.STRING },
              }},
            },
            achievements: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: {
                title: { type: Type.STRING }, issuer: { type: Type.STRING }, date: { type: Type.STRING }, certificateUrl: { type: Type.STRING },
              }},
            },
            publications: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: {
                title: { type: Type.STRING }, publisher: { type: Type.STRING }, link: { type: Type.STRING },
              }},
            },
          },
        },
      },
    });

    const outputText = response.text;
    if (!outputText) return NextResponse.json({ error: "No profile data could be extracted." }, { status: 422 });

    let parsedData: unknown;
    try { parsedData = JSON.parse(outputText); }
    catch { return NextResponse.json({ error: "The CV parser returned invalid data. Please try again." }, { status: 422 }); }

    return NextResponse.json({ profile: parsedData });
  } catch (err: any) {
    console.error("Gemini CV Parsing Error:", err);
    return NextResponse.json({ error: err?.message || "Failed to parse CV." }, { status: 500 });
  }
}
