import { Schema, model, Document } from "mongoose";

// TypeScript interface for the Altcha Challenge Document
interface IAltchaChallenge extends Document {
  challenge: string;
  signature: string;
  salt: string;
  algorithm: string;
  maxnumber?: number;
  createdAt: Date;
  isSolved: boolean;
}

// Mongoose schema definition
const AltchaChallengeSchema = new Schema<IAltchaChallenge>({
  challenge: { type: String, required: true },
  signature: { type: String, required: true },
  salt: { type: String, required: true },
  algorithm: { type: String, required: true },
  maxnumber: { type: Number },
  createdAt: { type: Date, default: Date.now }, // Automatically store the creation timestamp
  isSolved: { type: Boolean, default: false }, // Flag to check if the challenge has been solved
});

// Index the createdAt field to help with expiration logic if needed
AltchaChallengeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // 1-hour expiration

// Mongoose model for the AltchaChallenge collection
export const AltchaChallenge = model<IAltchaChallenge>(
  "AltchaChallenge",
  AltchaChallengeSchema
);
