import type { Application, NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export const addErrorHandlingToApp = (app: Application) => {
  app.use((_: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof MulterError) {
      return res.status(400).json({ message: "Invalid or oversized upload." });
    }
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error. Check the server console",
      });
    }
  });
};

export default addErrorHandlingToApp;
