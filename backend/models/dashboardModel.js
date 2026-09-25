import db from "../connection/connection.js";

const getOrderItems = async (orderId) => {
  const [rows] = await db.query(
    `SELECT
       orders.id AS order_id,
       u.username AS nama_pembeli,
       products.name AS nama_produk,
       order_items.quantity AS jumlah,
       order_items.price AS harga_satuan
     FROM orders_items AS order_items
     JOIN orders ON order_items.order_id = orders.id
     JOIN products ON order_items.product_id = products.id
     JOIN \`user\` AS u ON orders.user_id = u.id
     WHERE orders.id = ?
     ORDER BY order_items.id ASC`,
    [orderId],
  );
  return rows;
};

const getSummary = async (startDate, endDate) => {
  const [rows] = await db.query(
    `SELECT
       COALESCE(SUM(order_items.quantity * order_items.price), 0) AS totalSales,
       COUNT(DISTINCT orders.id) AS totalOrders,
       COALESCE(SUM(order_items.quantity * order_items.price) / NULLIF(COUNT(DISTINCT orders.id), 0), 0) AS averageOrderValue
     FROM orders_items AS order_items
     JOIN orders ON order_items.order_id = orders.id
     WHERE orders.created_at >= UNIX_TIMESTAMP(?) AND orders.created_at < UNIX_TIMESTAMP(?)`,
    [startDate, endDate],
  );
  return { ...rows[0], growthPercentage: 0 };
};

const getSalesOverview = async (startDate, endDate) => {
  const [rows] = await db.query(
    `SELECT DATE(FROM_UNIXTIME(orders.created_at)) AS date,
       COALESCE(SUM(order_items.quantity * order_items.price), 0) AS revenue,
       COUNT(DISTINCT orders.id) AS orders
     FROM orders_items AS order_items
     JOIN orders ON order_items.order_id = orders.id
     WHERE orders.created_at >= UNIX_TIMESTAMP(?) AND orders.created_at < UNIX_TIMESTAMP(?)
     GROUP BY DATE(FROM_UNIXTIME(orders.created_at))
     ORDER BY date ASC`,
    [startDate, endDate],
  );
  return rows.map((row) => ({ ...row, label: new Date(row.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) }));
};

const getTopProducts = async (startDate, endDate, limit) => {
  const [rows] = await db.query(
    `SELECT products.id, products.name, products.image, products.stock,
       SUM(order_items.quantity) AS totalSold,
       SUM(order_items.quantity * order_items.price) AS totalRevenue
     FROM orders_items AS order_items
     JOIN orders ON order_items.order_id = orders.id
     JOIN products ON order_items.product_id = products.id
     WHERE orders.created_at >= UNIX_TIMESTAMP(?) AND orders.created_at < UNIX_TIMESTAMP(?)
     GROUP BY products.id, products.name, products.image, products.stock
     ORDER BY totalSold DESC, totalRevenue DESC, products.name ASC
     LIMIT ?`,
    [startDate, endDate, limit],
  );
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
};

export default { getOrderItems, getSummary, getSalesOverview, getTopProducts };