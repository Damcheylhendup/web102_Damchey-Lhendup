const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://10.2.43.21:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to titok api");
});

module.exports = app;