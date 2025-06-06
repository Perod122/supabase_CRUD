import express from "express";
import { updateProduct, createProduct, getProducts, getProductById, deleteProduct, addToCart, fetchUserCart, deleteUserCart, updateCartQuantity } from "../controller/productController.js";
import { signUp, signIn, signOut, checkSession as checkSessionHandler, updateProfile } from "../controller/authController.js";
import checkSession from "../middleware/checkSession.js"; // This stays as is
import { getAllOrders, getUserOrders, placeOrder, updateOrderStatus } from "../controller/orderController.js";

const router = express.Router();
router.get("/session", checkSession, checkSessionHandler); 
// Products
router.get("/", checkSession, getProducts);
router.get("/orders", checkSession, getAllOrders);
router.get("/myorders", checkSession, getUserOrders);
router.get("/mycart", checkSession, fetchUserCart)
router.delete("/mycart/:id", checkSession, deleteUserCart)
router.put("/mycart/:id", checkSession, updateCartQuantity)
router.put("/profile", checkSession, updateProfile);
router.put("/orders/:id", checkSession, updateOrderStatus);
router.post("/create", checkSession, createProduct);
router.get("/:id", checkSession, getProductById); // dynamic route should be at the bottom
router.put("/:id", checkSession, updateProduct);
router.delete("/:id", checkSession, deleteProduct);
router.post("/add-to-cart", checkSession, addToCart);
router.post("/orders/place", checkSession, placeOrder); // Assuming you have a placeOrder function in your controller
 // Assuming you have a getUserOrders function in your controller
// Auth
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
