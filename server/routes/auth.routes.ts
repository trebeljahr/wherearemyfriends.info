import bcrypt from "bcryptjs";
import express, { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { TOKEN_SECRET } from "../config/envVars";

const router = express.Router();
const saltRounds = 10;

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/g;

const passwordRegexNotMatchingError =
  "Your password must have at least 12 characters and contain at least one number, one lowercase, one uppercase and one special character.";

router.post("/signup", async (req: Request, res: Response, _: NextFunction) => {
  const { email, password, username } = req.body;

  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and username" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message: passwordRegexNotMatchingError,
    });
    return;
  }

  const foundUserByEmail = await User.findOne({ email });

  if (foundUserByEmail) {
    return res.status(400).json({
      message: "A user with this email already exists. Please login instead.",
    });
  }

  const foundUserByUsername = await User.findOne({ username });

  if (foundUserByUsername) {
    return res.status(400).json({
      message:
        "A user with this username already exists. Please choose another username.",
    });
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const createdUser = await User.create({
    email,
    password: hashedPassword,
    username,
    profilePicture: "/assets/no-user.webp",
  });

  const user = {
    _id: createdUser._id,
    email: createdUser.email,
    username: createdUser.username,
  };

  res.status(201).json({ user: user });
});

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { emailOrUsername, password } = req.body;

    if (emailOrUsername === "" || password === "") {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }

    const foundUserByEmail = await User.findOne({ email: emailOrUsername });

    const foundUserByUsername = await User.findOne({
      username: emailOrUsername,
    });

    const foundUser = foundUserByEmail || foundUserByUsername;

    if (!foundUser) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      const { _id, email, username, profilePicture } = foundUser;

      const payload = { _id, email, username, profilePicture };

      const authToken = jwt.sign(payload, TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  }
);

router.post(
  "/change-password",
  jwtMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Provide old and new password" });
    }

    const user = await User.findById(req.auth?._id);

    if (!user) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const passwordCorrect = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/g;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: passwordRegexNotMatchingError,
      });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    try {
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password succesfully updated!" });
    } catch (error) {
      return res.status(500).json({ message: "Error saving the new password" });
    }
  }
);

router.get(
  "/verify",
  jwtMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.auth?._id)
      .populate("friends", "username email profilePicture")
      .populate("pendingFriendRequests privacySettings location");

    if (!user) {
      return res.status(403).json({ message: "User not authorized" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      location: user.location,
      friends: user.friends,
      email: user.email,
      privacySettings: user.privacySettings,
      pendingFriendRequests: user.pendingFriendRequests,
    });
  }
);

export default router;
