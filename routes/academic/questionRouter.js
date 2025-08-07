const express = require("express");
const questionRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");
const isTeacher = require("../../middlewares/isTeacher");
const {
  createQuestionCtrl,
  getQuestionsCtrl,
  getSingleQuestionCtrl,
  updateQuestionCtrl,
} = require("../../Controller/academics/questionsCtrl");

questionRouter.post("/:examId", isLogin, isTeacher, createQuestionCtrl);
questionRouter.get("/", isLogin, isTeacher, getQuestionsCtrl);
questionRouter.get("/:id", isLogin, isTeacher, getSingleQuestionCtrl);
questionRouter.put("/:id", isLogin, isTeacher, updateQuestionCtrl);

module.exports = questionRouter;
