import express, { type Request, Response, type Express } from "express";
import multer, { FileFilterCallback } from "multer";
import { z } from "zod";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import path from "path";

// Simple in-memory storage for Vercel
const summaries = new Map();

// Groq client setup
const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
});

// Schemas
const insertSummarySchema = z.object({
  title: z.string(),
  originalTranscript: z.string(),
  customInstructions: z.string(),
  generatedSummary: z.string(),
  editedSummary: z.string(),
});

const updateSummarySchema = insertSummarySchema.partial();

// File upload setup
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .txt files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Generate summary function
async function generateSummary(transcript: string, customInstructions?: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is required");
  }

  const prompt = customInstructions?.trim() 
    ? `Please process the following meeting transcript according to these specific instructions: "${customInstructions.trim()}"\n\nTranscript:\n${transcript}`
    : `Please summarize the following meeting transcript in a clear, well-structured format.\n\nTranscript:\n${transcript}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are an expert meeting summarizer. Create clear, professional summaries."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });

  const summary = response.choices[0]?.message?.content;
  if (!summary) {
    throw new Error("No summary was generated");
  }
  return summary.trim();
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.post("/api/summaries/generate", upload.single('transcript'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { customInstructions, title } = req.body;
    const transcriptText = req.file.buffer.toString('utf-8');

    if (!transcriptText.trim()) {
      return res.status(400).json({ message: "File appears to be empty" });
    }

    const generatedSummary = await generateSummary(transcriptText, customInstructions || "");
    
    const summaryData = {
      title: title || `Summary - ${new Date().toLocaleDateString()}`,
      originalTranscript: transcriptText,
      customInstructions: customInstructions || "",
      generatedSummary,
      editedSummary: generatedSummary,
    };

    const validatedData = insertSummarySchema.parse(summaryData);
    const id = randomUUID();
    const now = new Date();
    const savedSummary = { 
      ...validatedData, 
      id,
      createdAt: now,
      updatedAt: now
    };
    
    summaries.set(id, savedSummary);
    res.json(savedSummary);
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to generate summary" 
    });
  }
});

app.patch("/api/summaries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateSummarySchema.parse(req.body);
    
    const existing = summaries.get(id);
    if (!existing) {
      return res.status(404).json({ message: "Summary not found" });
    }

    const updated = { ...existing, ...validatedData, updatedAt: new Date() };
    summaries.set(id, updated);
    res.json(updated);
  } catch (error) {
    console.error("Error updating summary:", error);
    res.status(500).json({ message: "Failed to update summary" });
  }
});

app.get("/api/summaries", async (req, res) => {
  try {
    const allSummaries = Array.from(summaries.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(allSummaries);
  } catch (error) {
    console.error("Error fetching summaries:", error);
    res.status(500).json({ message: "Failed to fetch summaries" });
  }
});

app.get("/api/summaries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const summary = summaries.get(id);
    
    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

// Serve static files
app.use(express.static(path.join(process.cwd(), "dist/public")));

// Catch-all handler for SPA routing
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "dist/public/index.html"));
});

export default app;