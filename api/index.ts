import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);

// Serve built static files
app.use(express.static("dist/public"));

// Catch-all handler: send back React's index.html file for SPA routing
app.get("*", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: "dist/public" });
});

export default app;