import { Router } from "express";
import { z } from "zod";
import { generateCurriculum } from "../utils/generator";

const router = Router();

const RequestSchema = z.object({
  topic: z.string().min(2),
  audience: z.enum(["K-2", "3-5", "6-8", "9-12", "Undergrad", "Adult learners"]),
  length: z.object({
    weeks: z.number().int().positive(),
    classesPerWeek: z.number().int().positive(),
    minutesPerClass: z.number().int().positive(),
  }),
  goals: z.array(z.string()).min(1),
  standards: z.union([z.array(z.string()).min(1), z.literal("None")]),
  techAccess: z.enum(["Low", "Medium", "High"]),
  constraints: z.array(z.string()).optional(),
  differentiation: z.string().optional(),
});

router.post("/generate", async (req, res) => {
  const parsed = RequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }
  try {
    const doc = await generateCurriculum(parsed.data);
    res.json({ document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

export default router;

