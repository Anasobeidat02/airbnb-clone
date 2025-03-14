const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "BZ3mNu8AoLstIU2X";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
require("dotenv").config();
//1.28
//BZ3mNu8AoLstIU2X

// console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL);

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
          res.cookie("token", token).json("pass ok");
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

app.listen(4000);

// if (userDoc) {
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     res.json("pass ok");
//   } else {
//     res.status(422).json("invalid password");
//   }

// } else {
//   res.json("not found");
// }
