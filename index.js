const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt")
const express = require('express');
const app = express();
const path = require("path")
const PORT = 1111;
require("dotenv").config()
const db = require("./models/db.js")
const jwt=require("jsonwebtoken")

//middlewares
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


//view engine
app.set('view engine', "ejs")
app.set("views", path.resolve("views"))


//home page registration
app.get('/', (req, res) => {

  res.render("register")
});

//registration route
app.post('/register', (req, res) => {
  const { email, password } = req.body;

const token=jwt.sign({email},"secret")
res.cookie("token",token)
console.log(token)

  //hashing the password
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      const query = "insert into users (email,password) values (?,?)"
      const results = await db.execute(query, [email, hash])
    });
  });


  res.render("register")
})

//get cookie
app.get('/read',(req,res)=>{
const token=req.cookies.token
const data=jwt.verify(token,"secret")
res.json({token,data})
})

app.listen(PORT, () => {
  console.log(`Server running on port PORT`);
});

