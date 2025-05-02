import express from "express";
import { updateProduct, createProduct, getProducts, getProductById, deleteProduct, addToCart, fetchUserCart, deleteUserCart } from "../controller/productController.js";
import { signUp, signIn, signOut, checkSession as checkSessionHandler, updateProfile } from "../controller/authController.js";
import checkSession from "../middleware/checkSession.js"; // This stays as is
import { placeOrder } from "../controller/orderController.js";

const router = express.Router();
router.get("/session", checkSession, checkSessionHandler); 
// Products
router.get("/", checkSession, getProducts);
router.get("/mycart", checkSession, fetchUserCart)
router.delete("/mycart/:id", checkSession, deleteUserCart)
router.put("/profile", checkSession, updateProfile);
router.post("/create", checkSession, createProduct);
router.get("/:id", checkSession, getProductById); // dynamic route should be at the bottom
router.put("/:id", checkSession, updateProduct);
router.delete("/:id", checkSession, deleteProduct);
router.post("/add-to-cart", checkSession, addToCart);
router.post("/orders/place", checkSession, placeOrder); // Assuming you have a placeOrder function in your controller

// Auth
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
