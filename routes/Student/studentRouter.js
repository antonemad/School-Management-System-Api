const express = require("express");
const studentRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isStudent = require("../../middlewares/isStudent");

const {
  adminRegisterStudentCtrl,
  loginStudentCtrl,
  getStudentProfile,
  getAllStudentsByAdmin,
  getSingleStudentByAdmin,
  updateStudentProfileCtrl,
  updateStudentPasswordCtrl,
  adminUpdateStudent,
  writeExamCtrl,
} = require("../../Controller/Students/studentsCtrl");

studentRouter.post(
  "/admin/register",
  isLogin,
  isAdmin,
  adminRegisterStudentCtrl,
  writeExamCtrl
);

studentRouter.route("/admin").get(isLogin, isAdmin, getAllStudentsByAdmin);

studentRouter.route("/login").post(loginStudentCtrl);

studentRouter.route("/profile").get(isLogin, isStudent, getStudentProfile);

studentRouter
  .route("/:id/admin")
  .get(isLogin, isAdmin, getSingleStudentByAdmin);

studentRouter
  .route("/updateProfile")
  .put(isLogin, isStudent, updateStudentProfileCtrl);

studentRouter
  .route("/updatePassword")
  .put(isLogin, isStudent, updateStudentPasswordCtrl);

studentRouter
  .route("/:id/update/admin")
  .put(isLogin, isAdmin, adminUpdateStudent);

studentRouter
  .route("/exam/:examId/write")
  .post(isLogin, isStudent, writeExamCtrl);

module.exports = studentRouter;
