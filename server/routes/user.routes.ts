// routes/userRoutes.ts
import express, { Response } from "express";
import { Request } from "express-jwt";
import fs from "fs";
import multer from "multer";
import path from "path";
import {
  AuthenticatedRequest,
  isAuthenticated,
  jwtMiddleware,
} from "../middleware/jwt.middleware";
import User, {
  FriendPrivacy,
  IUser,
  SharingState,
  UserLocation,
} from "../models/User"; // Import User model
import { CORRECT_PATH } from "../config/envVars";

const router = express.Router();

router.use(jwtMiddleware);
router.use(isAuthenticated);

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dest = path.resolve(CORRECT_PATH, "public/uploads/profile_pictures/");

    cb(null, dest);
  },
  filename: (req: Request<{ _id: string }>, file, cb) => {
    const ext = path.extname(file.originalname);

    if (!req.auth) return cb(new Error("User ID not found"), "");

    const { _id: userId } = req.auth as { _id: string };

    cb(null, `${userId}${ext}`); // Use user ID as the filename
  },
});

// Initialize multer with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req: any, file: any, cb: any) => {
    // Accept image files only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Upload profile picture
router.post(
  "/users/profile-picture",
  upload.single("profilePicture"),
  async (req: AuthenticatedRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const { _id: userId } = req.auth as { _id: string };

    try {
      const user = await User.findById(userId);

      if (!user) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
      await user.save();

      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

function mapSharingStateToLocation(
  sharingState: SharingState,
  location?: UserLocation
) {
  if (!location) return;

  if (sharingState === "exact") {
    return location.exact;
  } else if (sharingState === "city") {
    return location.city;
  } else if (sharingState === "country") {
    return location.country;
  }
  return;
}

router.get("/friends", async (req: Request<{ _id: string }>, res) => {
  try {
    const { _id: userId } = req.auth as { _id: string };

    const user = await User.findById(userId)
      .populate("friends", "username profilePicture privacySettings location")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendsWithPrivacy = user.friends.map((friend: any) => {
      const typedFriend = friend as IUser;
      const sharingState =
        (typedFriend.privacySettings as FriendPrivacy[]).find(
          (setting) => setting.friendId.toString() === userId.toString()
        )?.visibility || "country";

      return {
        id: typedFriend._id,
        name: typedFriend.username,
        profilePicture: typedFriend.profilePicture || "/assets/no-user.webp",
        sharingState,
        location: mapSharingStateToLocation(sharingState, typedFriend.location),
      };
    });

    return res.json(friendsWithPrivacy);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/friends", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.friends.includes(friend.id) ||
      !friend.friends.includes(user.id)
    ) {
      return res.status(400).json({ message: "User is not your friend" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    user.privacySettings = user.privacySettings.filter(
      (setting) => setting.friendId.toString() !== friendId
    );

    friend.privacySettings = friend.privacySettings.filter(
      (setting) => setting.friendId.toString() !== userId
    );

    await user.save();
    await friend.save();

    return res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/friends/privacy", async (req: Request, res) => {
  const { _id: currentUserId } = req.auth as { _id: string };
  const { friendId, newVisibility } = req.body;

  try {
    const user = await User.findById(currentUserId);

    if (
      !user ||
      !user.friends.includes(friendId) ||
      friendId === currentUserId
    ) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendPrivacy = user.privacySettings.find(
      (privacy: any) => privacy.friendId.toString() === friendId
    );

    if (friendPrivacy) {
      friendPrivacy.visibility = newVisibility;
    } else {
      user.privacySettings.push({
        friendId: friendId,
        visibility: newVisibility,
      });
    }

    await user.save(); // Save the changes
    return res.json({ message: "Privacy settings updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/:username", async (req: Request, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne(
      { username },
      "username profilePicture"
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/search", async (req: Request, res) => {
  try {
    console.log("Searching for user");
    const { username } = req.query;
    const { _id: currentUserId } = req.auth as { _id: string };

    console.log(username, currentUserId);

    const friend = await User.findOne({ username });
    const user = await User.findById(currentUserId);

    console.log(friend, user);

    if (!friend) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user) {
      return res
        .status(403)
        .json({ message: "It seems like you are not authenticated." });
    }

    if (friend.id === currentUserId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    if (friend.friends.includes(user.id) || user.friends.includes(friend.id)) {
      return res.status(400).json({ message: "User is already your friend." });
    }

    if (
      friend.pendingFriendRequests.includes(user.id) ||
      user.pendingFriendRequests.includes(friend.id)
    ) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    return res.json(friend);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/friends/requests", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.id === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });
    }

    if (user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    if (user.sentFriendRequests.includes(user.id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    friend.pendingFriendRequests.push(user.id);
    await friend.save();

    user.sentFriendRequests.push(friendId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/friends/requests", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  try {
    const user = await User.findById(userId)
      .populate("pendingFriendRequests", "username profilePicture")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingRequests = user.pendingFriendRequests.map(
      (requester: any) => ({
        id: requester._id,
        username: requester.username,
        profilePicture: requester.profilePicture || "/assets/no-user.webp",
      })
    );

    return res.json(pendingRequests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/friends/requests/accept", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { requesterId } = req.body;

  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (
      !user ||
      !requester ||
      user.friends.includes(requesterId) ||
      user.id === requesterId
    ) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.pendingFriendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ message: "No pending friend request from this user" });
    }

    user.pendingFriendRequests = user.pendingFriendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.sentFriendRequests = requester.sentFriendRequests.filter(
      (id) => id.toString() !== userId
    );

    user.friends.push(requesterId);
    requester.friends.push(user.id);

    user.privacySettings.push({
      friendId: requesterId,
      visibility: "city",
    });

    requester.privacySettings.push({
      friendId: user.id,
      visibility: "city",
    });

    await user.save();
    await requester.save();

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/friends/requests/decline", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { requesterId } = req.body;

  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.id === requesterId) {
      return res
        .status(400)
        .json({ message: "You cannot decline your own friend request" });
    }

    if (!user.pendingFriendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ message: "No pending friend request from this user" });
    }

    user.pendingFriendRequests = user.pendingFriendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.sentFriendRequests = requester.sentFriendRequests.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await requester.save();

    return res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/users/location", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { country, city, exact } = req.body as UserLocation;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.location = {
      lastUpdated: new Date(),
      country,
      city,
      exact,
    };

    await user.save();

    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
