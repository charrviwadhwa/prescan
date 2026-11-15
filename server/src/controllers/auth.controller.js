
import { z } from "zod";
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/auth.service.js";
import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../db/schema/users.js";

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72)
});

export const register = async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Please provide valid registration details."
    });
  }

  try {
    const user = await registerUser(validation.data);

    return res.status(201).json({
      message: "Account created successfully!",
      user
    });
  } catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

export const login = async (req, res) => {
  const loginSchema = z.object({
    email: z.string().trim().email().max(255),
    password: z.string().min(1).max(72)
  });

  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Please provide valid login details."
    });
  }

  try {
    const user = await loginUser(validation.data);

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
        message: "Login successful.",
        token,
        user
    });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        message: "User account not found."
      });
    }

    return res.status(200).json({
      user
    });

  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

export const logout = (req, res) => {
  return res.status(200).json({
    message: "Logged out successfully."
  });
};
