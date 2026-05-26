import mysql from "mysql"; // 1. Ubah ke mysql2 agar support ES Module import dengan lancar
import dotenv from "dotenv";

// 2. WAJIB dipanggil di baris paling atas agar file .env bisa terbaca
dotenv.config({ path: "../.env" });

const dbPassword = process.env.PASSWORD_DB;
const db = process.env.DATABASE;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: dbPassword,
  database: "rest-api",
});

// 3. Perbaikan fungsi pengecekan koneksi
con.connect(function (err) {
  if (err) {
    console.error("❌ Koneksi ke MySQL Gagal:", err.message);
    return;
  }
  console.log("🚀 Sukses! Database MySQL berhasil terhubung.");
});

export default con;
