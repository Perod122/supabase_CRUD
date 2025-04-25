import express from "express";
import { updateProduct, createProduct, getProducts, getProductById, deleteProduct } from "../controller/productController.js";
import { signUp, signIn, signOut, checkSession as checkSessionHandler } from "../controller/authController.js";
import checkSession from "../middleware/checkSession.js"; // This stays as is

const router = express.Router();
router.get("/session", checkSession, checkSessionHandler); 
// Products
router.get("/products", checkSession, getProducts);
router.post("/create", checkSession, createProduct);
router.get("/:id", checkSession, getProductById); // dynamic route should be at the bottom
router.put("/:id", checkSession, updateProduct);
router.delete("/:id", checkSession, deleteProduct);

// Auth
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
