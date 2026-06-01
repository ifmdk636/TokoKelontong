import db from "../../connection/connection.js";

// 1. Get All User
const getUserByEmailAndPassword = async (email, password) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM `user_e-commerce` WHERE email = ? AND password = ?",
      [email, password],
    );

    // Cek apakah user ditemukan
    // if (rows.length === 0) {
    //   return null;
    // }

    // Return user pertama
    return rows[0];
  } catch (err) {
    throw err;
  }
};

// 2. Create User (Tambahkan parameter data user yang akan didaftarkan)
const createUser = async (email, phone, username, password) => {
  try {
    // Verifikasi email terdaftar
    // MASUKKAN variabel data ke dalam array sebagai argumen kedua db.query
    const [result] = await db.query(
      "INSERT INTO `user_e-commerce` (email, phone, username, password) VALUES (?, ?, ?, ?)",
      [email, phone, username, password],
    );

    // Mengembalikan ID user baru yang berhasil terbuat
  } catch (err) {
    console.error("Error di createUser:", err);
    throw err;
  }
};

const deleteUser = async (idUser) => {
  try {
    const deleteUser = await db.query(
      "DELETE FROM `user_e-commerce` WHERE id = ?",
      [idUser],
    );
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (idUser) => {
  try {
    const updateUser = await db.query(
      "UPDATE `user_e-commerce` SET email=?, username=?, phone=?, password=?",
    );
  } catch (err) {
    console.log(err);
  }
};

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `user_e-commerce` WHERE email = ? LIMIT 1",
      [email],
      (err, results) => {
        if (err) {
          console.error("Error di findByEmail:", err);
          reject(err);
        } else {
          resolve(results[0]);
        }
      },
    );
  });
};

// 3. Perbaikan gaya penulisan export default yang valid
const userModel = {
  getUserByEmailAndPassword,
  createUser,
  deleteUser,
  findByEmail,
};

export default userModel;
