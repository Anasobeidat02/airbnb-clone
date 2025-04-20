const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user.js");
const Place = require("./models/place.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);
const cookieParser = require("cookie-parser");
const jwtSecret = "BZ3mNu8AoLstIU2X";
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
require("dotenv").config();
//3.36
//BZ3mNu8AoLstIU2X

// console.log(process.env.MONGO_URL)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/test", (req, res) => {
  res.json("Hello, World!");
});

app.post("/register", async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const userDoc = await User.create({
      name,
      password: bcrypt.hashSync(password, bcryptSalt),
      email,
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
  //   res.json(userDoc);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const isValidPassword = bcrypt.compareSync(password, userDoc.password);
    if (isValidPassword) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, {
              httpOnly: true, // يمنع الوصول للكوكي من JavaScript في المتصفح
              secure: false, // يجب أن يكون false عند العمل على localhost بدون HTTPS
              sameSite: "Lax", // يسمح بإرسال الكوكي في نفس الموقع (بدون مشاكل CORS)
            })
            .json(userDoc);
          // res.cookie('token','').json('pass ok');
        }
      );
    } else {
      return res.status(422).json({ message: "Invalid  password" });
    }
  } else {
    return res.status(422).json({ message: "User not found" });
  }

  // res.json(userDoc);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
  // res.json({ token });
});

app.post("/logout", (req, res) => {
  res.cookie("token", " ").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});
const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    // فقط اسم الملف بدون المسار
    uploadedFiles.push(newPath.split("/").pop());
  }

  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.listen(4000);
