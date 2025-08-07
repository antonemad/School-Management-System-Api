const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something Went Wrong Please try again",
  };

  console.log(err.stack);

  return res.status(customError.statusCode).json({
    msg: customError.msg,
  });
};

module.exports = errorHandlerMiddleware;
