// routes/userRoutes.ts
import express from "express";
import User from "../models/User"; // Import User model
import mongoose from "mongoose";

const router = express.Router();

// Get the user's friends and privacy settings
router.get("/friends/:userId", async (req, res) => {
  console.log(req.params);

  try {
    const { userId } = req.params;

    // Fetch the user with their friends and privacy settings
    const user = await User.findById(userId)
      .populate("friends", "username avatar") // Populate the friend's username and avatar
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendsWithPrivacy = user.friends.map((friend: any) => {
      // Find the privacy setting for the current friend
      const privacySetting = user.privacySettings.find(
        (privacy: any) => privacy.friendId.toString() === friend._id.toString()
      ) || { visibility: "none" }; // Default to 'none' if no setting

      return {
        id: friend._id,
        name: friend.username,
        avatar: friend.avatar || "https://picsum.photos/50/50",
        sharingState: privacySetting.visibility,
      };
    });

    return res.json(friendsWithPrivacy);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/friends/:userId/privacy", async (req, res) => {
  console.log(req.params);

  const { userId } = req.params;
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

// Add a friend to the user's friends list
router.post("/friends/:userId/add", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    // Check if both users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found" });
    }

    // Check if the friend is already in the user's friends list
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: "Friend already added" });
    }

    // Add the friend to the user's friends list
    user.friends.push(friendId);
    await user.save();

    return res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/users/search", async (req, res) => {
  console.log(req.query);
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

// Update the user's location
router.put("/users/:userId/location", async (req, res) => {
  const { userId } = req.params;
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
