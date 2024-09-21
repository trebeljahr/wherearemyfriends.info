// models/User.ts
import { Schema, model, Document } from "mongoose";

// Define a TypeScript interface for the User document
interface FriendPrivacy {
  friendId: Schema.Types.ObjectId;
  visibility: "none" | "country" | "city" | "nearby" | "exact";
}

interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  lastUpdated: Date;
  country: string;
  city: string;
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  location: Location;
  friends: Schema.Types.ObjectId[];
  privacySettings: FriendPrivacy[];
  pendingFriendRequests: Schema.Types.ObjectId[];
}

// Sub-schema for friend-specific privacy settings
const FriendPrivacySchema = new Schema<FriendPrivacy>({
  friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  visibility: {
    type: String,
    enum: ["full", "city", "country", "none"],
    default: "none",
  },
});

// Main User schema
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [0, 0],
    },
    lastUpdated: { type: Date, default: Date.now },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  pendingFriendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }], // Add this line
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  privacySettings: [FriendPrivacySchema],
});

// Create a geospatial index on the coordinates field
UserSchema.index({ location: "2dsphere" });

const User = model<IUser>("User", UserSchema);

export default User;
