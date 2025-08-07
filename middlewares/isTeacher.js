const Teacher = require("../model/Staff/Teacher");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const CustomError = require("../errors");

const isAdmin = asyncErrorHandler(async (req, res, next) => {
  //find the user
  const userId = req.userAuth.userId;
  const teacherFound = await Teacher.findById(userId);
  //Check if teacher
  if (teacherFound?.role === "teacher") {
    next();
  } else {
    throw new CustomError.UnauthorizedError(`Access denied, teachers only`);
  }
});

module.exports = isAdmin;
