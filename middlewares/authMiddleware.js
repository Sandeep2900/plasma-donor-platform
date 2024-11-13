const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers["authorization"];

    // Check if the authorization header exists
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Check if the token is present
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth failed",
        });
      } else {
        // Attach the userId to the request object
        req.body.userId = decode.userId;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred during authentication",
    });
  }
};
