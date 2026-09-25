import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
let con;
try {
  con = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DATABASE,
  });

  await con.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image TEXT NOT NULL,
      price VARCHAR(50) NOT NULL,
      variant JSON NULL,
      rating DECIMAL(3,1) DEFAULT 0,
      sold INT DEFAULT 0,
      location VARCHAR(100) DEFAULT '',
      description TEXT,
      stock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Database lama mungkin sudah memiliki tabel products dengan struktur
  // berbeda. CREATE TABLE IF NOT EXISTS tidak mengubah tabel yang sudah ada,
  // jadi tambahkan kolom yang dibutuhkan aplikasi secara aman.
  const productColumns = [
    ["name", "VARCHAR(255) NULL"],
    ["image", "TEXT NULL"],
    ["price", "VARCHAR(50) NULL"],
    ["variant", "JSON NULL"],
    ["rating", "DECIMAL(3,1) DEFAULT 0"],
    ["sold", "INT DEFAULT 0"],
    ["location", "VARCHAR(100) DEFAULT ''"],
    ["description", "TEXT NULL"],
    ["stock", "INT DEFAULT 0"],
    ["created_at", "TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP"],
  ];

  for (const [column, definition] of productColumns) {
    await con.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS \`${column}\` ${definition}`);
  }

  await con.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_product (user_id, product_id),
      CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES \`user_e-commerce\`(id) ON DELETE CASCADE,
      CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  console.log("🚀 Sukses! Database MySQL berhasil terhubung.");
} catch (err) {
  console.error("Koneksi MySQL gagal:", err.message);
  con = null;
}

export default con;
