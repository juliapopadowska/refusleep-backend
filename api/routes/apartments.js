import express from "express";
import mongoose from "mongoose";
import Place from "../models/Place.js";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();
const jwtSecret = "askujhdfsudafhisldhfud";

router.get("/", (req, res) => {
  res.send("apartments");
});

router.post("/add", (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { token } = req.cookies;
  const {
    cityName,
    address,
    type,
    polishDetails,
    englishDetails,
    frenchDetails,
    ukrainianDetails,
    phone,
    addedPhotos,
  } = req.body;
  jsonwebtoken.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const place = await Place.create({
      owner: userData.id,
      city: cityName,
      type,
      address,
      polishDetails,
      englishDetails,
      frenchDetails,
      ukrainianDetails,
      photos: addedPhotos,
      phoneNumber: phone,
    });
    res.json(place);
  });
});

router.put("/add", (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { token } = req.cookies;
  const {
    id,
    cityName,
    address,
    type,
    polishDetails,
    englishDetails,
    frenchDetails,
    ukrainianDetails,
    phone,
    addedPhotos,
  } = req.body;
  jsonwebtoken.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const place = await Place.findById(id);
    if (userData.id === place.owner.toString()) {
      place.set({
        cityName,
        address,
        type,
        polishDetails,
        englishDetails,
        frenchDetails,
        ukrainianDetails,
        phone,
        photos: addedPhotos,
      });
      await place.save();
      res.json("ok");
    }
  });
});

router.get("/apartments", async (req, res) => {
  mongoose.connect(process.env.MONGO);
  res.json(await Place.find());
});

router.get("/apartment/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

export default router;
