import bcrypt from "bcrypt";
import express, { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import User from "../models/User";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
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

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const user = {
      _id: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
    };

    res.status(201).json({ user: user });
  }
);

// POST  /auth/login - Verifies email and password and returns a JWT
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

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get(
  "/verify",
  jwtMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(req.auth);
  }
);

export default router;
