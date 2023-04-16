import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("users");
});

router.post("/user-by-id", async (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { owner } = req.body;
  res.json(await User.findById(owner));
});

export default router;
