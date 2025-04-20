import express from "express";
import { updateProduct, createProduct, getProducts, getProductById } from "../controller/productController.js";
import { signUp, signIn } from "../controller/authController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;