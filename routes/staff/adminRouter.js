const express = require("express");
const adminRouter = express.Router();

const advancedResults = require("../../middlewares/advancedResults");
const Admin = require("../../model/Staff/Admin");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const {
  registerAdminCtrl,
  loginAdminCtrl,
  getAdminsCtrl,
  getAdminProfileCtrl,
  updateAdminCtrl,
  updateAdminPasswordCtrl,
} = require("../../Controller/staff/adminCtrl");

//register
adminRouter.post("/register", registerAdminCtrl);

//login
adminRouter.post("/login", loginAdminCtrl);

//get all admins
adminRouter.get(
  "/",
  isLogin,
  isAdmin,
  advancedResults(Admin, "teachers students"),
  getAdminsCtrl
);

//get single admin
adminRouter.get("/profile", isLogin, getAdminProfileCtrl);

//update admin
adminRouter.put("/updateAdmin", isLogin, updateAdminCtrl);

adminRouter.put("/updateAdminPassword", isLogin, updateAdminPasswordCtrl);

module.exports = adminRouter;
