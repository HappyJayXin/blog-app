const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getTotals } = require("../services/stats");

router.get("/", async (req, res) => {
  let totals = { totalPosts: 0, totalComments: 0 };
  const state = mongoose.connection.readyState;
  if (state === 1) {
    try {
      totals = await getTotals();
    } catch (err) {
      console.error("db query error", err);
    }
  } else {
    console.error("db state", state);
  }
  res.render("index", {
    title: "Blog App",
    message: "歡迎來到我的 Blog !",
    ...totals
  });
});

module.exports = router;

