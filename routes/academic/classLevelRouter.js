const express = require("express");
const classLevelRouter = express.Router();

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const {
  createClassLevelCtrl,
  getClassLevelsCtrl,
  getSingleClassLevelCtrl,
  updateClassLevelCtrl,
  deleteClassLevelCtrl,
} = require("../../Controller/academics/classLevelCtrl");

classLevelRouter
  .route("/")
  .post(isLogin, isAdmin, createClassLevelCtrl)
  .get(isLogin, isAdmin, getClassLevelsCtrl);

classLevelRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleClassLevelCtrl)
  .put(isLogin, isAdmin, updateClassLevelCtrl)
  .delete(isLogin, isAdmin, deleteClassLevelCtrl);

module.exports = classLevelRouter;
