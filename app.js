import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import errorMiddelware from "./middelwares/errorMiddelware.js";

const app = express();

// middlwares
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/ping", (req,res)=>{
    res.send('/pong');
});

app.use("/api/vi/routes", userRoutes);

app.all('*', (req, res)=>{
    res.status(404).send("OOPS! 404 Page not found..");
});

app.use(errorMiddelware);

export default app;


