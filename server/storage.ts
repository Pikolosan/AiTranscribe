import { type User, type InsertUser, type Summary, type InsertSummary, type UpdateSummary } from "@shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSummary(id: string): Promise<Summary | undefined>;
  getAllSummaries(): Promise<Summary[]>;
  createSummary(summary: InsertSummary): Promise<Summary>;
  updateSummary(id: string, data: UpdateSummary): Promise<Summary | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private summaries: Map<string, Summary>;

  constructor() {
    this.users = new Map();
    this.summaries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSummary(id: string): Promise<Summary | undefined> {
    return this.summaries.get(id);
  }

  async getAllSummaries(): Promise<Summary[]> {
    return Array.from(this.summaries.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const id = randomUUID();
    const now = new Date();
    const summary: Summary = { 
      ...insertSummary, 
      id,
      customInstructions: insertSummary.customInstructions ?? null,
      editedSummary: insertSummary.editedSummary ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.summaries.set(id, summary);
    return summary;
  }

  async updateSummary(id: string, data: UpdateSummary): Promise<Summary | undefined> {
    const existing = this.summaries.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Summary = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    
    this.summaries.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
