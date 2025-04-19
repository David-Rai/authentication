const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const path = require("path");
const PORT = 1111;
require("dotenv").config();
const db = require("./models/db.js");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth.js");
const { body, validationResult } = require("express-validator");

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

//home page registration
app.get("/", (req, res) => {
  res.render("home");
});

//registration route
app.post(
  "/register",
  [
    body("name").notEmpty().withMessage("name is required"),
    body("email").notEmpty().isEmail().withMessage("email is required"),
    body("password").notEmpty().withMessage("password is required"),
  ],
  (req, res) => {
    //data authtentication
    const results = validationResult(req);
    if (!results.errors.length == 0) {
      console.log("not valid");
    return res.json({ status: 400, message: results.errors });
    }

    // console.log(results.errors.length)

    const { name, email, password } = req.body;

    //hashing the password
    bcrypt.hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.
      const query = "insert into users (name,email,password) values (?,?,?)";
      const results = await db.execute(query, [name, email, hash]);
    });

    res.redirect("/login");
  }
);

//login route
app.get("/login", (req, res) => {
  console.log("loginning")
  res.render("login");
});

//main logining logic
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "select * from users where email=?";
  const [r] = await db.execute(query, [email]);

  if (r.length === 0) {
    res.status(404).json({ message: "something is wrong ", status: 404 });
  }

  bcrypt.compare(password, r[0].password, (err, result) => {
    if (!result) {
    return  res.status(404).json({ message: "something is wrong " });
    }
  });

  //creating the token to authenticate users again
  const secretCode = process.env.SECRET;
  const token = jwt.sign({ name: r[0].name, email: r[0].email }, secretCode,{
    expiresIn:'2s'
  });
  
  res.cookie("token", token, {
    secure: false,
    httpOnly: true,
    maxAge: 10000,
    sameSite: "lax",
    path: "/",
  });

  // res.send(`you are login ${r[0].name}`)
  res.redirect("/dash");
});

//dashboard
app.get("/dash", auth, (req, res) => {
  const data = req.user;

  if (!data) {
    res.redirect("/");
  }

  res.render("dash", { data });
});

//logging out feature
app.post("/log", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict", // Protect from CSRF
  });

  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server running on port PORT`);
});
