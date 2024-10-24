const cookieParser = require("cookie-parser");
const cors = require("cors");

const express = require("express");
const app = express();

app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));

app.use(cookieParser());

app.use("ping", (req,res)=>{
    res.send('/pong');
});

app.all('*', (req, res)=>{
    res.status(404).send("OOPS! 404 Page not found..");
});

module.exports = app;


