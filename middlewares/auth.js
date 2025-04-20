const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.cookies.token;
    

  if (!token) {
    return res.redirect("/");
  }

  const secret=process.env.SECRET
  const data=jwt.verify(token,secret)


    req.user = data;
    next();

}

module.exports = auth;
