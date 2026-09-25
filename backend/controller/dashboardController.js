import dashboardModel from "../models/dashboardModel.js";

const parseDate = (value, fallback) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  return value;
};

const getDateRange = (req) => ({
  startDate: parseDate(req.query.startDate, "1970-01-01"),
  endDate: parseDate(req.query.endDate, "2999-12-31"),
});

const getOrderItems = async (req, res) => {
  const orderId = Number(req.params.orderId || req.query.orderId);
  if (!Number.isInteger(orderId) || orderId < 1) return res.status(400).json({ message: "orderId tidak valid" });
  try { return res.json({ data: await dashboardModel.getOrderItems(orderId) }); }
  catch (error) { console.error("Error detail order:", error); return res.status(500).json({ message: "Gagal mengambil detail order" }); }
};

const getSummary = async (req, res) => {
  try { return res.json({ data: await dashboardModel.getSummary(...Object.values(getDateRange(req))) }); }
  catch (error) { console.error("Error dashboard summary:", error); return res.status(500).json({ message: "Gagal mengambil ringkasan dashboard" }); }
};

const getSalesOverview = async (req, res) => {
  try { return res.json({ data: await dashboardModel.getSalesOverview(...Object.values(getDateRange(req))) }); }
  catch (error) { console.error("Error sales overview:", error); return res.status(500).json({ message: "Gagal mengambil grafik penjualan" }); }
};

const getTopProducts = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  try { return res.json({ data: await dashboardModel.getTopProducts(...Object.values(getDateRange(req)), limit) }); }
  catch (error) { console.error("Error top products:", error); return res.status(500).json({ message: "Gagal mengambil produk terlaris" }); }
};

export default { getOrderItems, getSummary, getSalesOverview, getTopProducts };