const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,POST', 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const Routes = require("./routes/personalRoutes");
const userRouter = require("./routes/userRoutes");

app.get("/", (req, res) => {
  res.send("hello World");
});

app.use("/api/v1", Routes);
app.use("/api/v1/user", userRouter);
module.exports = { app };
