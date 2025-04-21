import express from "express";
import { updateProduct, createProduct, getProducts, getProductById } from "../controller/productController.js";
import { signUp, signIn, signOut, checkSession } from "../controller/authController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);

// ✅ Put this before :id
router.get("/session", checkSession);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

router.get("/:id", getProductById); // move this to the bottom of your GET routes
router.put("/:id", updateProduct);

// Rule of Thumb
//Always define specific routes before dynamic ones like /:id, or else Express will interpret anything (even strings like "session") as an id.


export default router;