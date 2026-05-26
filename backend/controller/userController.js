import userModel from "../models/userModel/user.js";

const getAllUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const rows = await userModel.getAllUser(idUser);
    if (!rows) {
      return res.status(400).json({
        message: "Data not found",
      });
    }
    return res.status(200).json({
      message: "Get data success",
    });
  } catch (err) {
    console.log(err);
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
  getAllUser,
  createUser,
  deleteUser,
};

export default userController;
