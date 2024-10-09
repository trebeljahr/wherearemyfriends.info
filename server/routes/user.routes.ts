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
import User, {
  FriendPrivacy,
  IUser,
  SharingState,
  UserLocation,
} from "../models/User"; // Import User model

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
      return res.status(404).json({ error: "User not found" });
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

router.get("/friends/requests", async (req: Request, res) => {
  const { _id: userId } = req.auth as { _id: string };
  try {
    const user = await User.findById(userId)
      .populate("pendingFriendRequests", "username profilePicture")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
  const { country, city, exact } = req.body as UserLocation;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's location
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
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
