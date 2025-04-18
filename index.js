const cookieParser = require('cookie-parser');
const bcrypt=require("bcrypt")
const express = require('express');
const app = express();
const path=require("path")
const PORT =  1111;
require("dotenv").config()
const db=require("./models/db.js")

//middlewares
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:false}))


//view engine
app.set('view engine',"ejs")
app.set("views",path.resolve("views"))

app.get('/', (req, res) => {

  res.render("register")
});

app.post('/register',async (req,res)=>{
const {email,password}=req.body;

//hashing the password
bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(password, salt, function(err, hash) {
      // Store hash in your password DB.
      console.log(hash)
  });
});

const query="insert into users (email,password) values (?,?)"
const results=await db.execute(query,[email,password])
console.log(results)

  res.render("register")
})

app.listen(PORT, () => {
  console.log(`Server running on port PORT`);
});

