const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

app.use(express.json()); // Middleware function: converts frontend data into json
app.listen(3000);
app.use(cookieParser());

const userRouter = require("./routers/userRouter");
const planRouter = require("./routers/planRouter");
const reviewRouter = require("./routers/reviewRouter");

app.use("/user", userRouter);
app.use("/plans", planRouter);
app.use("/review", reviewRouter);
