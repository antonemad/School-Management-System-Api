const express = require("express");
const examRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacher = require("../../middlewares/isTeacher");
const {
  createExam,
  getExams,
  getSingleExam,
  updateExam,
} = require("../../Controller/academics/examsCtrl");

examRouter
  .route("/")
  .post(isLogin, isTeacher, createExam)
  .get(isLogin, isTeacher, getExams);

examRouter
  .route("/:id")
  .get(isLogin, isTeacher, getSingleExam)
  .put(isLogin, isTeacher, updateExam);

module.exports = examRouter;
 