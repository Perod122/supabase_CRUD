import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import pageRoutes from "./routes/pageRoutes.js";
import { supabase } from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";

const __dirname = path.resolve();
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
    ? process.env.VERCEL_URL 
    : "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet(
    {
        contentSecurityPolicy: false,
      }
));

app.use("/api/products", pageRoutes);
if (process.env.NODE_ENV === "production") {
    // server our react app
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
    app.get('/{*any}', (req, res) => {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
  }
async function initDB() {
    try {
        const {data, error} = await supabase.from("Products").select("*");
        if(error){
            console.error("Supabase error", error.message);
            return
        }
        console.log("Supabase connection successful");
    } catch (err) {
        console.error("Supabase error connection", err);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Listing to port "+PORT);
    });
});
    