const express = require("express");
const academicTermsRouter = express.Router();
const {
  createAcademicTermCtrl,
  getAcademicTermsCtrl,
  getSingleAcademictermCtrl,
  updateAcademicTermCtrl,
  deleteAcademicTermCtrl,
} = require("../../Controller/academics/academicTermCtrl");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

academicTermsRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicTermCtrl)
  .get(isLogin, isAdmin, getAcademicTermsCtrl);

academicTermsRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleAcademictermCtrl)
  .put(isLogin, isAdmin, updateAcademicTermCtrl)
  .delete(isLogin, isAdmin, deleteAcademicTermCtrl);

module.exports = academicTermsRouter;
