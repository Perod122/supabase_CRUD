import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import pageRoutes from "./routes/pageRoutes.js";
import { supabase } from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true
  }));
  app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

app.use("/api", pageRoutes);

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
    