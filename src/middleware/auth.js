const jwt = require("jsonwebtoken");
const jwtSecret = "usama@228@";

module.exports = function (req, res, next) {
  // Get token from cookies or headers
  const token = req.cookies.token;

  // Check if no token
  if (!token) {
    req.user = null;
    return next();
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user; // Set user from token payload
    console.log(req.user);
    next();
  } catch (err) {
    req.user = null; // Token not valid
    next();
  }
};
