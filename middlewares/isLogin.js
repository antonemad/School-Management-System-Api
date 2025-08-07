const asyncErrorHandler = require("../errors/asyncErrorHandler");
const { verifyToken } = require("../utils");
const CustomError = require("../errors");

const isLogin = asyncErrorHandler(async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }
  //verify token
  try {
    const decodedToken = verifyToken({ token });
    req.userAuth = decodedToken;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError(
      "Invalid/Expired token, Please login back"
    );
  }
});

module.exports = isLogin;
