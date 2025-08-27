import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export type CurriculumRequest = {
  topic: string;
  audience: "K-2" | "3-5" | "6-8" | "9-12" | "Undergrad" | "Adult learners";
  length: { weeks: number; classesPerWeek: number; minutesPerClass: number };
  goals: string[];
  standards: string[] | "None";
  techAccess: "Low" | "Medium" | "High";
  constraints?: string[];
  differentiation?: string;
};

const systemPrompt = `You are an expert in pedagogy, education, computer science, curriculum design, and lesson planning. Generate a full curriculum document ready for PDF export. Follow these sections: 1) Title Page, 2) Overview, 3) Scope and Sequence, 4) Daily Lesson Plans, 5) Assessment Plan, 6) Adaptations, 7) Resources, 8) Appendices. Use clear, professional, teacher-friendly language. Always include scaffolding, retrieval practice, and differentiation. Vary Bloom's taxonomy levels across lessons.`;

function buildUserPrompt(req: CurriculumRequest): string {
  const goals = req.goals.map((g) => `- ${g}`).join("\n");
  const constraints = req.constraints?.map((c) => `- ${c}`).join("\n") || "None";
  const standards = Array.isArray(req.standards) ? req.standards.join(", ") : "None";
  return `USER INPUTS:\n- Topic or Course: ${req.topic}\n- Audience grade/level: ${req.audience}\n- Course length: ${req.length.weeks} weeks, ${req.length.classesPerWeek} classes per week, ${req.length.minutesPerClass} minutes per class\n- Learning goals:\n${goals}\n- Standards: ${standards}\n- Tech access level: ${req.techAccess}\n- Constraints:\n${constraints}\n- Differentiation notes: ${req.differentiation || "None"}\n\nOUTPUT REQUIREMENTS:\nGenerate the full curriculum with the required sections and teacher-ready formatting.`;
}

function buildFallback(req: CurriculumRequest): string {
  const weeks = req.length.weeks;
  const totalLessons = weeks * req.length.classesPerWeek;
  return `Curriculum placeholder for ${req.topic} (${req.audience})\nWeeks: ${req.length.weeks}, Classes/Week: ${req.length.classesPerWeek}, Minutes/Class: ${req.length.minutesPerClass}\nGoals: ${req.goals.join("; ")}\nStandards: ${Array.isArray(req.standards) ? req.standards.join(", ") : "None"}\nTech: ${req.techAccess}\nNotes: ${req.differentiation || ""}\n\nThis is a local fallback summary because OPENAI_API_KEY is not configured. Total lessons: ${totalLessons}.`;
}

export async function generateCurriculum(req: CurriculumRequest): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return buildFallback(req);
  }
  const openai = new OpenAI({ apiKey });
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: buildUserPrompt(req) },
  ];
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.6,
    max_tokens: 4000,
  });
  return completion.choices?.[0]?.message?.content?.trim() || "";
}

