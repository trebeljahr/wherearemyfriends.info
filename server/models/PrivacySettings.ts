// models/PrivacySetting.ts
import { Schema, model, Document } from "mongoose";
import { SharingState } from "./User";

interface IPrivacySetting extends Document {
  userId: Schema.Types.ObjectId;
  friendId: Schema.Types.ObjectId;
  visibility: SharingState;
}

const PrivacySettingSchema = new Schema<IPrivacySetting>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  visibility: {
    type: String,
    enum: ["none", "country", "city", "exact"],
    default: "none",
  },
});

const PrivacySetting = model<IPrivacySetting>(
  "PrivacySetting",
  PrivacySettingSchema
);

export default PrivacySetting;
