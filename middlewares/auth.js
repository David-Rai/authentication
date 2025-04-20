const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
<<<<<<< HEAD
    const token = req.cookies.token;
    
    if (!token) {
    res.redirect("/")
    }
=======
  const token = req.cookies.token;
>>>>>>> 323ffa6d8f829c52ede939045fac1659a262a9f9

  if (!token) {
    return res.redirect("/");
  }

<<<<<<< HEAD
    req.user = data

    next()
=======
  try {
    const secretCode = process.env.SECRET;
    const data = jwt.verify(token, secretCode);
>>>>>>> 323ffa6d8f829c52ede939045fac1659a262a9f9

    req.user = data;
    next();
  } 
  catch (err) {
    console.error("JWT Error:", err.message);
    return res.redirect("/");
  }
};

module.exports = auth;
