import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer, { FileFilterCallback } from "multer";
import { storage } from "./storage";
import { insertSummarySchema, updateSummarySchema } from "@shared/schema";
import { z } from "zod";
import { generateSummary } from "./groq";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept text files, Word docs, and PDFs
    const allowedTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .txt, .docx, and .pdf files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and generate summary endpoint
  app.post("/api/summaries/generate", upload.single('transcript'), async (req, res) => {
    try {
      console.log("Upload request received:");
      console.log("- File:", req.file ? `${req.file.originalname} (${req.file.size} bytes)` : "none");
      console.log("- Body:", req.body);
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { customInstructions, title } = req.body;
      
      // Extract text from uploaded file
      let transcriptText = '';
      if (req.file.mimetype === 'text/plain') {
        transcriptText = req.file.buffer.toString('utf-8');
      } else {
        // For now, assume text extraction is handled client-side for non-txt files
        // In production, you'd use libraries like pdf-parse or mammoth for docx
        return res.status(400).json({ message: "Only .txt files are currently supported" });
      }

      if (!transcriptText.trim()) {
        return res.status(400).json({ message: "File appears to be empty" });
      }

      // Generate summary using Grok API
      const generatedSummary = await generateSummary(transcriptText, customInstructions || "");
      
      // Save to storage
      const summaryData = {
        title: title || `Summary - ${new Date().toLocaleDateString()}`,
        originalTranscript: transcriptText,
        customInstructions: customInstructions || "",
        generatedSummary,
        editedSummary: generatedSummary, // Initially same as generated
      };

      const validatedData = insertSummarySchema.parse(summaryData);
      const savedSummary = await storage.createSummary(validatedData);

      res.json(savedSummary);
    } catch (error) {
      console.error("Error generating summary:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data provided", errors: error.errors });
      }
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate summary" 
      });
    }
  });

  // Update summary endpoint
  app.patch("/api/summaries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateSummarySchema.parse(req.body);
      
      const updatedSummary = await storage.updateSummary(id, validatedData);
      if (!updatedSummary) {
        return res.status(404).json({ message: "Summary not found" });
      }

      res.json(updatedSummary);
    } catch (error) {
      console.error("Error updating summary:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data provided", errors: error.errors });
      }
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to update summary" 
      });
    }
  });

  // Get all summaries endpoint
  app.get("/api/summaries", async (req, res) => {
    try {
      const summaries = await storage.getAllSummaries();
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      res.status(500).json({ message: "Failed to fetch summaries" });
    }
  });

  // Get single summary endpoint
  app.get("/api/summaries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const summary = await storage.getSummary(id);
      
      if (!summary) {
        return res.status(404).json({ message: "Summary not found" });
      }

      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ message: "Failed to fetch summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
