import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import apartmentsRoute from "./routes/apartments.js";
import cors from "cors";
// import multer from "multer";
// import fs from "fs";
import cookieParser from "cookie-parser";

const app = express();

// app.use(
//   cors({
//     credentials: true,
//     origin: "https://refusleep-frontend.vercel.app/",
//   })
// );

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("mongo");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("connected");
});

app.get("/", (req, res) => {
  res.send("hello");
});

// const photosMiddleware = multer({ dest: "uploads/" });

// app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
//   const uploadedFiles = [];
//   for (let i = 0; i < req.files.length; i++) {
//     const { path, originalname } = req.files[i];
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//     uploadedFiles.push(newPath.replace("uploads/", ""));
//   }
//   res.json(uploadedFiles);
// });

//middlewares

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/apartments", apartmentsRoute);

app.listen(8800, () => {
  connect();
  console.log("backend!");
});
