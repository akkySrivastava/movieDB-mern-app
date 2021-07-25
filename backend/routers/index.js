const express = require("express");
const router = express.Router();
const fileRouter = require("./File");
const movieRouter = require("./Movie");

router.get("/", (req, res) => {
  res.send("Welcome to MovieDB");
});

router.use("/file", fileRouter);
router.use("/movie", movieRouter);

module.exports = router;
