import type { NextFunction, Request, Response } from "express";
import express from "express";

const router = express.Router();

router.get("/", (_: Request, res: Response, _next: NextFunction) => {
  res.json("All good in here");
});

export default router;
