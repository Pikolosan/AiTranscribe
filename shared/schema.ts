import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const summaries = pgTable("summaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  originalTranscript: text("original_transcript").notNull(),
  customInstructions: text("custom_instructions"),
  generatedSummary: text("generated_summary").notNull(),
  editedSummary: text("edited_summary"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSummarySchema = createInsertSchema(summaries).pick({
  title: true,
  originalTranscript: true,
  customInstructions: true,
  generatedSummary: true,
  editedSummary: true,
});

export const updateSummarySchema = createInsertSchema(summaries).pick({
  editedSummary: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Summary = typeof summaries.$inferSelect;
export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type UpdateSummary = z.infer<typeof updateSummarySchema>;
