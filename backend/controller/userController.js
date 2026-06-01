import dotenv from "dotenv";
// Load .env
dotenv.config({ path: "../../../.env" });
import userModel from "../models/userModel/user.js";
import authMid from "../middleware/authMiddleware.js";

import jwt from "jsonwebtoken";

const getUserEmailAndPasword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user
    const user = await userModel.getUserByEmailAndPassword(email, password);
    const generateToken = (user) => {
      return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "3s" },
      );
    };
    console.log({ generateToken });
    const token = generateToken(user);
    return res.status(200).json({
      message: "Login berhasil",
      token: token,
    });
    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({
        message: "Login gagal, email atau password salah",
      });
    }

    // Login berhasil
    return res.status(200).json({
      message: "Login berhasil",
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
  createUser,
  deleteUser,
};

export default userController;
