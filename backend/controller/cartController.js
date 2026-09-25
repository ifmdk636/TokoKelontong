import cartModel from "../models/cartModel.js";

const getCart = async (req, res) => {
  try {
    return res.json(await cartModel.getCart(req.user.id));
  } catch (error) {
    console.error("Error getCart:", error);
    return res.status(500).json({ message: "Gagal mengambil keranjang" });
  }
};

const addItem = async (req, res) => {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity || 1);
    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "productId dan quantity tidak valid" });
    }
    return res.status(201).json(
      await cartModel.addItem(req.user.id, productId, quantity),
    );
  } catch (error) {
    console.error("Error addItem:", error);
    return res.status(500).json({ message: "Gagal menambahkan ke keranjang" });
  }
};

const updateItem = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (quantity < 1) return res.status(400).json({ message: "quantity minimal 1" });
    return res.json(await cartModel.updateItem(req.user.id, req.params.id, quantity));
  } catch (error) {
    console.error("Error updateItem:", error);
    return res.status(500).json({ message: "Gagal memperbarui keranjang" });
  }
};

const removeItem = async (req, res) => {
  try {
    return res.json(await cartModel.removeItem(req.user.id, req.params.id));
  } catch (error) {
    console.error("Error removeItem:", error);
    return res.status(500).json({ message: "Gagal menghapus item" });
  }
};

export default { getCart, addItem, updateItem, removeItem };
