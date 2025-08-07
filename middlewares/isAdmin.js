const Admin = require("../model/Staff/Admin");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const CustomError = require("../errors");

const isAdmin = asyncErrorHandler(async (req, res, next) => {
  //find the user
  const userId = req.userAuth.userId;
  const adminFound = await Admin.findById(userId);
  //Check if admin
  if (adminFound?.role === "admin") {
    next();
  } else {
    throw new CustomError.UnauthorizedError(`Access Denied, admin only`);
  }
});

module.exports = isAdmin;
