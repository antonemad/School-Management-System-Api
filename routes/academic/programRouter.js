const express = require("express");
const programRouter = express.Router();

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const {
  createProgramCtrl,
  getProgramsCtrl,
  getSingleProgramCtrl,
  updateProgramCtrl,
  deleteProgramCtrl,
} = require("../../Controller/academics/programsCtrl");

programRouter
  .route("/")
  .post(isLogin, isAdmin, createProgramCtrl)
  .get(isLogin, isAdmin, getProgramsCtrl);

programRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleProgramCtrl)
  .put(isLogin, isAdmin, updateProgramCtrl)
  .delete(isLogin, isAdmin, deleteProgramCtrl);

module.exports = programRouter;
