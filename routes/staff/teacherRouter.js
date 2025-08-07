const express = require("express");
const teacherRouter = express.Router();

const Teacher = require("../../model/Staff/Teacher");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacher = require("../../middlewares/isTeacher");
const {
  adminRegisterTeacherCtrl,
  loginTeacherCtrl,
  getAllTeachersAdminCtrl,
  getSingleTeacherAdminCtrl,
  getTeacherProfileCtrl,
  updateTeacherProfileCtrl,
  updateTeacherPasswordCtrl,
  adminUpdateTeacherCtrl,
} = require("../../Controller/staff/teachersCtrl");
const advancedResults = require("../../middlewares/advancedResults");

teacherRouter.post(
  "/admin/register",
  isLogin,
  isAdmin,
  adminRegisterTeacherCtrl
);
teacherRouter.post("/login", loginTeacherCtrl);
teacherRouter.get(
  "/admin",
  isLogin,
  isAdmin,
  advancedResults(Teacher, "examsCreated"),
  getAllTeachersAdminCtrl
);
teacherRouter.get(
  "/admin/:teacherId",
  isLogin,
  isAdmin,
  getSingleTeacherAdminCtrl
);

teacherRouter.get("/profile", isLogin, isTeacher, getTeacherProfileCtrl);

teacherRouter.put(
  "/updateProfile",
  isLogin,
  isTeacher,
  updateTeacherProfileCtrl
);
teacherRouter.put(
  "/updatePassword",
  isLogin,
  isTeacher,
  updateTeacherPasswordCtrl
);

teacherRouter.put(
  "/:teacherId/update/admin",
  isLogin,
  isAdmin,
  adminUpdateTeacherCtrl
);

module.exports = teacherRouter;
