import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./db/index.js";
import greetRoute from "./routes/greet.routes.js"
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CORS,
  })
);

app.use("/api/v1/greet",greetRoute)

export default app;