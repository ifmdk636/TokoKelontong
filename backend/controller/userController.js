import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
import userModel from "../models/user.js";
import authMid from "../middleware/authMiddleware.js";

import jwt from "jsonwebtoken";

const getUserEmailAndPasword = async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    // Cari user
    const user = await userModel.getUserByEmailAndPassword(email, password);
    const generateToken = (user) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET belum dikonfigurasi");
      }
      return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
    };
    if (!user) {
      return res.status(401).json({
        message: "Login gagal, email atau password salah",
      });
    }
    const token = generateToken(user);
    return res.status(200).json({
      message: "Login berhasil",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error login:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, username, phone, password } = req.body;

    // Validasi input
    if (!email || !username || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Cek email sudah ada atau belum
    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    // Simpan user
    const insertId = await userModel.createUser(
      email,
      phone,
      username,
      password,
    );

    // Gagal insert
    if (!insertId) {
      return res.status(500).json({
        message: "Failed to create user",
      });
    }

    // Success
    return res.status(201).json({
      message: "User created successfully",
      userId: insertId,
    });
  } catch (err) {
    console.error("Error createUser:", err);

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error getCurrentUser:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = userModel.deleteUser(id);
    if (deleteUser) {
      return res.status(200).json({
        message: "Delete User Success",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const userController = {
  getUserEmailAndPasword,
  getCurrentUser,
  createUser,
  deleteUser,
};

export default userController;
