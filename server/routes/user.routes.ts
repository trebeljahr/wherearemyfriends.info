// routes/userRoutes.ts
import express from "express";
import { Request } from "express-jwt";
import fs from "fs";
import multer from "multer";
import path from "path";
import {
  AuthenticatedRequest,
  isAuthenticated,
  jwtMiddleware,
} from "../middleware/jwt.middleware";
import User, { FriendPrivacy } from "../models/User"; // Import User model

const router = express.Router();

router.use(jwtMiddleware);
router.use(isAuthenticated);

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/profile_pictures/"));
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
      return res.status(400).json({ error: "Please upload a file" });
    }

    const { _id: userId } = req.auth as { _id: string };

    try {
      const user = await User.findById(userId);

      if (!user) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "User not found" });
      }

      user.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
      await user.save();

      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get the user's friends and privacy settings
router.get("/friends", async (req: Request<{ _id: string }>, res) => {
  try {
    const { _id: userId } = req.auth as { _id: string };

    // Fetch the user with their friends and privacy settings
    const user = await User.findById(userId)
      .populate("friends", "username avatar privacySettings") // Populate the friend's username and avatar
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendsWithPrivacy = user.friends.map((friend: any) => {
      console.log(friend);

      const sharingState = (friend.privacySettings as FriendPrivacy[]).find(
        (setting) => setting.friendId.toString() === userId.toString()
      );

      console.log(sharingState, friend.username);

      return {
        id: friend._id,
        name: friend.username,
        avatar: friend.avatar || "https://picsum.photos/50/50",
        sharingState,
      };
    });

    return res.json(friendsWithPrivacy);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/friends/privacy", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { friendId, newVisibility } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the privacy setting for this friend
    const friendPrivacy = user.privacySettings.find(
      (privacy: any) => privacy.friendId.toString() === friendId
    );

    if (friendPrivacy) {
      // Update the existing privacy setting
      friendPrivacy.visibility = newVisibility;
    } else {
      // Add a new privacy setting for this friend
      user.privacySettings.push({
        friendId: friendId,
        visibility: newVisibility,
      });
    }

    await user.save(); // Save the changes
    return res.json({ message: "Privacy settings updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/users/search", async (req: Request, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// routes/userRoutes.ts

// Send a friend request

router.post("/friends/requests", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string }; // ID of the user sending the request
  const { friendId } = req.body; // ID of the user to send the request to

  try {
    // Check if both users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found" });
    }

    // Check if they are already friends
    if (user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ error: "You are already friends with this user" });
    }

    // Check if a friend request has already been sent
    if (friend.pendingFriendRequests.includes(user.id)) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Add the friend request to the recipient's pending requests
    friend.pendingFriendRequests.push(user.id);
    await friend.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// routes/userRoutes.ts

// Get pending friend requests for a user
router.get("/friends/requests", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  try {
    // Fetch the user and populate the pendingFriendRequests field
    const user = await User.findById(userId)
      .populate("pendingFriendRequests", "username avatar") // Populate username and avatar
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pendingRequests = user.pendingFriendRequests.map(
      (requester: any) => ({
        id: requester._id,
        username: requester.username,
        avatar: requester.avatar || "https://picsum.photos/50/50",
      })
    );

    return res.json(pendingRequests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// routes/userRoutes.ts

// Accept a friend request
router.post("/friends/requests/accept", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { requesterId } = req.body; // ID of the user who sent the request

  try {
    // Fetch both users
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if there is a pending friend request from requesterId
    if (!user.pendingFriendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ error: "No pending friend request from this user" });
    }

    // Remove the requesterId from pendingFriendRequests
    user.pendingFriendRequests = user.pendingFriendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    // Add each other to friends list
    user.friends.push(requesterId);
    requester.friends.push(user.id);

    // Save both users
    await user.save();
    await requester.save();

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// routes/userRoutes.ts

// Decline a friend request
router.post("/friends/requests/decline", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { requesterId } = req.body; // ID of the user who sent the request

  try {
    // Fetch the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if there is a pending friend request from requesterId
    if (!user.pendingFriendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ error: "No pending friend request from this user" });
    }

    // Remove the requesterId from pendingFriendRequests
    user.pendingFriendRequests = user.pendingFriendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    // Save the user
    await user.save();

    return res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Update the user's location
router.put("/users/location", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  const { coordinates } = req.body;

  if (
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number" ||
    coordinates.length !== 2
  ) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's location
    user.location.coordinates = coordinates as [number, number];
    user.location.lastUpdated = new Date();
    await user.save();

    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
