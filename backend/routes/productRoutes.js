import express from "express";
import productController from "../controller/productController.js";
import authMid from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", authMid.authMiddleware, productController.createProduct);
router.put("/:id", authMid.authMiddleware, productController.updateProduct);
router.delete("/:id", authMid.authMiddleware, productController.deleteProduct);

export default router;
