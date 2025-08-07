const Student = require("../model/Academic/Student");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const CustomError = require("../errors");

const isStudent = asyncErrorHandler(async (req, res, next) => {
  //find the user
  const userId = req.userAuth.userId;
  const studentFound = await Student.findById(userId);
  //Check if teacher
  if (studentFound?.role === "student") {
    next();
  } else {
    throw new CustomError.UnauthorizedError(`Access denied, student only`);
  }
});

module.exports = isStudent;
