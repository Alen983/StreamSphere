const jwt = require("jsonwebtoken");

const requireLogin = (req, res, next) => {
  const token = req.headers["authorization"];

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    console.log(err);
    if (err) {
      console.log("Unauthorized.");
      return res
        .status(401)
        .json({ message: "You have to log in to continue" });
    }
    req.user = user;
    console.log("User: ", user);
    next();
  });
};

module.exports = requireLogin;