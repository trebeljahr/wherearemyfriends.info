// models/User.ts
import { Schema, model, Document } from "mongoose";

export type SharingState = "full" | "city" | "country" | "none";
// Define a TypeScript interface for the User document
export interface FriendPrivacy {
  friendId: Schema.Types.ObjectId;
  visibility: SharingState;
}

export interface SingleLocation {
  name: string;
  coordinates: [number, number];
}

export interface UserLocation {
  lastUpdated: Date;
  country: SingleLocation;
  city?: SingleLocation;
  exact?: SingleLocation;
}

const SingleLocationSchema = new Schema<SingleLocation>({
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  // required: false,
});

// Define the UserLocation schema
const UserLocationSchema = new Schema<UserLocation>({
  lastUpdated: {
    type: Date,
    required: true,
  },
  country: SingleLocationSchema,
  city: SingleLocationSchema,
  exact: SingleLocationSchema,
});

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  location?: UserLocation;
  friends: Schema.Types.ObjectId[];
  privacySettings: FriendPrivacy[];
  pendingFriendRequests: Schema.Types.ObjectId[];
  profilePicture: string;
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
  location: UserLocationSchema,
  pendingFriendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }], // Add this line
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  privacySettings: [FriendPrivacySchema],
  profilePicture: { type: String, default: "/assets/no-user.webp" },
});

// Create a geospatial index on the coordinates field
UserSchema.index({ location: "2dsphere" });

const User = model<IUser>("User", UserSchema);

export default User;
