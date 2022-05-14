const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    // jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: false, message: "Unauthorized." });
  }
}

module.exports = auth;
