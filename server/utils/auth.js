const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = process.env.JWT_SECRET || "notsosecret";
const expiration = "3m";

module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log("Invalid token: ", err.message);
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  refreshToken: function (token) {
    try {
      const { data } = jwt.verify(token, secret);
      return this.signToken(data);
    } catch (err) {
      console.log("Invalid token for refresh: ", err.message);
      return null;
    }
  },
};
