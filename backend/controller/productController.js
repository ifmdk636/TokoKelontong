import productModel from "../models/productModel.js";

const getProducts = async (_req, res) => {
  try {
    return res.json(await productModel.getProducts());
  } catch (error) {
    console.error("Error getProducts:", error);
    return res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
    return res.json(product);
  } catch (error) {
    console.error("Error getProduct:", error);
    return res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
      return res.status(400).json({ message: "name, price, dan image wajib diisi" });
    }
    return res.status(201).json(await productModel.createProduct(req.body));
  } catch (error) {
    console.error("Error createProduct:", error);
    return res.status(500).json({ message: "Gagal membuat produk" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productModel.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
    return res.json(product);
  } catch (error) {
    console.error("Error updateProduct:", error);
    return res.status(500).json({ message: "Gagal memperbarui produk" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Produk tidak ditemukan" });
    return res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteProduct:", error);
    return res.status(500).json({ message: "Gagal menghapus produk" });
  }
};

export default { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
