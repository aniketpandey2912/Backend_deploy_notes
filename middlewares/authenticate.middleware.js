const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const decoded = jwt.verify(token, "shhhhh");
    if (decoded) {
      const userID = decoded.userID;
      req.body.userID = userID;
      next();
    } else {
      res.send({ msg: "Please login first" });
    }
  } else {
    res.send({ msg: "Please login first" });
  }
};

module.exports = { authenticate };
