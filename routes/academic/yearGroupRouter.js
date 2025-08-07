const express = require("express");
const yearGroupRouter = express.Router();
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

const {
  createYearGroupCtrl,
  getYearGroupsCtrl,
  getSingleYearGroupCtrl,
  updateYearGroupCtrl,
  deleteYearGroupCtrl,
} = require("../../Controller/academics/yearGroupCtrl");

yearGroupRouter
  .route("/")
  .post(isLogin, isAdmin, createYearGroupCtrl)
  .get(isLogin, isAdmin, getYearGroupsCtrl);

yearGroupRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleYearGroupCtrl)
  .put(isLogin, isAdmin, updateYearGroupCtrl)
  .delete(isLogin, isAdmin, deleteYearGroupCtrl);

module.exports = yearGroupRouter;
