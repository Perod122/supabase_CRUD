import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("GET /pages route working");
});


export default router;