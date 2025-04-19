const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const secretCode = process.env.SECRET;
    const data = jwt.verify(token, secretCode);

    req.user = data;
    next();
  } 
  catch (err) {
    console.error("JWT Error:", err.message);
    return res.redirect("/");
  }
};

module.exports = auth;
