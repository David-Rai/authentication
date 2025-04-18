const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt")
const express = require('express');
const app = express();
const path = require("path")
const PORT = 1111;
require("dotenv").config()
const db = require("./models/db.js")
const jwt = require("jsonwebtoken");
const { CLIENT_RENEG_LIMIT } = require('tls');

//middlewares
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


//view engine
app.set('view engine', "ejs")
app.set("views", path.resolve("views"))


//home page registration
app.get('/', (req, res) => {

  res.render("home")
});

//registration route
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  //hashing the password
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      const query = "insert into users (name,email,password) values (?,?,?)"
      const results = await db.execute(query, [name, email, hash])
    })
  })

  res.redirect("/login")
})

//login route
app.get('/login', (req, res) => {
  res.render("login")
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const query = "select * from users where email=?"
  const [r] = await db.execute(query, [email])

  if(r.length ===0){
    res.status(404).json({ message: "something is wrong " ,status:404})

  }

  bcrypt.compare(password, r[0].password, (err, result) => {
    if (!result) {
      res.status(404).json({ message: "something is wrong " })
    }
  })

  res.send(`you are login ${r[0].name}`)

})

app.listen(PORT, () => {
  console.log(`Server running on port PORT`);
});

