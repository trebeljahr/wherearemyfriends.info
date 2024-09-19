// models/PrivacySetting.ts
import { Schema, model, Document } from "mongoose";

interface IPrivacySetting extends Document {
  userId: Schema.Types.ObjectId;
  friendId: Schema.Types.ObjectId;
  visibility: "none" | "country" | "city" | "nearby" | "exact";
}

const PrivacySettingSchema = new Schema<IPrivacySetting>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  visibility: {
    type: String,
    enum: ["none", "country", "city", "nearby", "exact"],
    default: "none",
  },
});

const PrivacySetting = model<IPrivacySetting>(
  "PrivacySetting",
  PrivacySettingSchema
);

export default PrivacySetting;
