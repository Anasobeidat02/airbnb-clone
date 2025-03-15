const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);
const cookieParser = require("cookie-parser");
const jwtSecret = "BZ3mNu8AoLstIU2X";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
require("dotenv").config();
//1.39
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

app.listen(4000);
