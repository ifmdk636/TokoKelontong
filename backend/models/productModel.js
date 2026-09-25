import db from "../connection/connection.js";

const getProducts = async () => {
  // `id` selalu tersedia, termasuk pada tabel products lama yang belum
  // memiliki kolom created_at.
  const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

// admin create product
const createProduct = async (product) => {
  const [result] = await db.query(
    `INSERT INTO products
      (name, image, price, variant, rating, sold, location, description, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.name,
      product.image,
      product.price,
      JSON.stringify(product.variant || []),
      product.rating || 0,
      product.sold || 0,
      product.location || "",
      product.description || "",
      product.stock || 0,
    ],
  );
  return getProductById(result.insertId);
};

// admin update products
const updateProduct = async (id, product) => {
  await db.query(
    `UPDATE products SET name=?, image=?, price=?, variant=?, rating=?,
      sold=?, location=?, description=?, stock=? WHERE id=?`,
    [
      product.name,
      product.image,
      product.price,
      JSON.stringify(product.variant || []),
      product.rating || 0,
      product.sold || 0,
      product.location || "",
      product.description || "",
      product.stock || 0,
      id,
    ],
  );
  return getProductById(id);
};

// admin delete products
const deleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

// dashboard products admin
const getProductCount = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM products");
  return rows[0].count;
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
};
