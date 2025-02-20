require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res
        .status(401)
        .json({ status: false, message: "auth token required" });

    let token = req.headers.authorization.replace("Bearer ", "");
    let decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.User = decode;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};
module.exports = tokenVerify;
