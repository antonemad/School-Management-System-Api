const express = require("express");
const subjectRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const {
  createSubjectCtrl,
  getSubjectsCtrl,
  getSingleSubjectCtrl,
  updateSubjectCtrl,
  deleteSubjectCtrl,
} = require("../../Controller/academics/subjectsCtrl");

subjectRouter.post("/:programId", isLogin, isAdmin, createSubjectCtrl);

subjectRouter.get("/", isLogin, isAdmin, getSubjectsCtrl);

subjectRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleSubjectCtrl)
  .put(isLogin, isAdmin, updateSubjectCtrl)
  .delete(isLogin, isAdmin, deleteSubjectCtrl);

module.exports = subjectRouter;
