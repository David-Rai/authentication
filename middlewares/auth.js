const jwt=require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
    res.redirect("/")
    }

    //verifying the token and getting the data
    const secretCode = process.env.SECRET
    const data = jwt.verify(token, secretCode)

    req.user = data

    next()

}

module.exports=auth