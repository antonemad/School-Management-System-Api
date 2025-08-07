const express = require("express");
const examResultsRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");
const isStudent = require("../../middlewares/isStudent");
const isAdmin = require("../../middlewares/isAdmin");

const {
  checkExamResult,
  getAllExamResults,
  adminToggleExamResult,
} = require("../../Controller/academics/examResultsCtrl");

examResultsRouter.get("/:id/checking", isLogin, isStudent, checkExamResult);
examResultsRouter.get("/", isLogin, isStudent, getAllExamResults);
examResultsRouter.put(
  "/:id/admin-toggle-publish",
  isLogin,
  isAdmin,
  adminToggleExamResult
);

module.exports = examResultsRouter;
