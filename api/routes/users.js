import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Place from "../models/Place.js";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

const jwtSecret = "askujhdfsudafhisldhfud";

router.get("/", (req, res) => {
  res.send("users");
});

router.post("/user-by-id", async (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { owner } = req.body;
  res.json(await User.findById(owner));
});

router.get("/profile", (req, res) => {
  const origin = req.headers.Origin;
  console.log(origin);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
  mongoose.connect(process.env.MONGO);
  const { token } = req.cookies;
  if (token) {
    jsonwebtoken.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

router.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { token } = req.cookies;
  jsonwebtoken.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

router.put("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { token } = req.cookies;
  const { id, name } = req.body;
  jsonwebtoken.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const user = await User.findById(id);
    if (userData.id === user.id) {
      user.set({
        name: name,
      });
      await user.save();
      res.json("ok");
    }
  });
});

router.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

export default router;
