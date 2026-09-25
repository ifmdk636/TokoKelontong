import db from "../connection/connection.js";

const getCart = async (userId) => {
  const [rows] = await db.query(
    `SELECT cart_items.id, cart_items.product_id, cart_items.quantity,
      products.name, products.image, products.price
      FROM cart_items JOIN products ON products.id = cart_items.product_id
      WHERE cart_items.user_id = ? ORDER BY cart_items.created_at DESC`,
    [userId],
  );
  return rows;
};

const addItem = async (userId, productId, quantity) => {
  await db.query(
    `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, quantity],
  );
  return getCart(userId);
};

const updateItem = async (userId, itemId, quantity) => {
  await db.query(
    "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, itemId, userId],
  );
  return getCart(userId);
};

const removeItem = async (userId, itemId) => {
  await db.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [
    itemId,
    userId,
  ]);
  return getCart(userId);
};

export default { getCart, addItem, updateItem, removeItem };
