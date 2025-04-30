import express from "express";
import { updateProduct, createProduct, getProducts, getProductById, deleteProduct, addToCart, fetchUserCart } from "../controller/productController.js";
import { signUp, signIn, signOut, checkSession as checkSessionHandler, updateProfile } from "../controller/authController.js";
import checkSession from "../middleware/checkSession.js"; // This stays as is

const router = express.Router();
router.get("/session", checkSession, checkSessionHandler); 
// Products
router.get("/", checkSession, getProducts);
router.get("/mycart", checkSession, fetchUserCart)
router.put("/profile", checkSession, updateProfile);
router.post("/create", checkSession, createProduct);
router.get("/:id", checkSession, getProductById); // dynamic route should be at the bottom
router.put("/:id", checkSession, updateProduct);
router.delete("/:id", checkSession, deleteProduct);
router.post("/add-to-cart", checkSession, addToCart);

// Auth
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
