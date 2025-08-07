const CustomError = require("../errors");
const notFound = (req, res, next) => {
  next(
    new CustomError.NotFoundError(`Can't find ${req.originalUrl} on the Server`)
  );
};

module.exports = notFound;
