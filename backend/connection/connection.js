import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load .env
dotenv.config({ path: "../.env" });

let con;

try {
  con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: process.env.DATABASE,
  });

  console.log("🚀 Sukses! Database MySQL berhasil terhubung.");
} catch (err) {
  console.error(err);
}

export default con;
