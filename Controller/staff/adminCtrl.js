const Admin = require("../../model/Staff/Admin");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { attachCookiesToResponse } = require("../../utils");
const { StatusCodes } = require("http-status-codes");

//@desc      Register admin
//@route     POST/api/admins/register
//@access    Private
const registerAdminCtrl = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //check if email exist
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    throw new CustomError.BadRequestError(`Admin already exist`);
  }

  const user = await Admin.create({
    name,
    email,
    password,
  });

  attachCookiesToResponse({ res, user });

  res.status(201).json({
    message: "Admin registered successfully",
    data: user,
  });
});

//@desc        Login admin
//@route       POST/api/admins/login
//@access      Private
const loginAdminCtrl = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Email and password are required");
  }

  // Check if admin exists , password is correct
  const user = await Admin.findOne({ email });

  if (!user || !(await user.verifyPassword(password))) {
    throw new CustomError.BadRequestError("Invalid login credentials");
  }

  attachCookiesToResponse({ res, user });

  res.status(StatusCodes.OK).json({
    message: "Admin logged in successfully",
    data: user,
  });
});

//@desc      Get All admins
//@route     GET/api/admins
//@access    Private
const getAdminsCtrl = async (req, res) => {
  res.status(StatusCodes.OK).json(res.results);
};

//@desc      Get Single admin
//@route     GET/api/admins/:id
//@access    Private
const getAdminProfileCtrl = asyncErrorHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth.userId)
    .populate("academicYears")
    .populate("academicTerms")
    .populate("programs")
    .populate("yearGroups")
    .populate("classLevels")
    .populate("teachers")
    .populate("students");

  if (!admin) {
    throw new CustomError.NotFoundError(`Admin Not Found`);
  }
  res.status(StatusCodes.OK).json({
    message: "Admin profile fetched successfully ",
    data: { admin },
  });
});

//@desc      Update admin (name,email)
//@route     PUT/api/admins/updateAdmin
//@access    Private
const updateAdminCtrl = asyncErrorHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth.userId);
  const { name, email } = req.body;
  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.userAuth.userId,
    { name, email },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({
    data: updatedAdmin,
    message: "Admin updated successfully",
  });
});

//@desc      Update admin Password
//@route     GET/api/admins/updateAdminPassword
//@access    Private
const updateAdminPasswordCtrl = asyncErrorHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.userAuth.userId);
  if (!(await admin.verifyPassword(currentPassword))) {
    throw new CustomError.UnauthorizedError(
      "The Current password you provided is Wrong"
    );
  }
  console.log(admin);
  admin.password = newPassword;
  await admin.save();
  attachCookiesToResponse({ res, user: admin });
  res.status(StatusCodes.OK).json({
    msg: "password updated successfully",
    data: admin,
  });
});

module.exports = {
  registerAdminCtrl,
  loginAdminCtrl,
  getAdminsCtrl,
  getAdminProfileCtrl,
  updateAdminCtrl,
  updateAdminPasswordCtrl,
};
