import express from "express";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

const secret = bcryptjs.genSaltSync(10);
const jwtSecret = "askujhdfsudafhisldhfud";

router.get("/", (req, res) => {
  res.send("auth");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password: bcryptjs.hashSync(password, secret),
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });
  if (user) {
    const passwordFound = bcryptjs.compareSync(password, user.password);

    if (passwordFound) {
      jsonwebtoken.sign(
        { email: user.email, id: user._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.status(422).json("password not ok");
    }
  } else {
    res.json("not found");
  }
});

export default router;
