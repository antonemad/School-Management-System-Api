const Admin = require("../../model/Staff/Admin");
const Teacher = require("../../model/Staff/Teacher");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const { attachCookiesToResponse } = require("../../utils");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const filterReqObj = require("../../utils/filterReqObj");

//@desc       Admin Register Teacher
//@route      POST /api/teachers/admin/register
//@access     Private
const adminRegisterTeacherCtrl = asyncErrorHandler(async (req, res) => {
  //check for admin
  const admin = await Admin.findById(req.userAuth.userId);
  if (!admin) {
    throw new CustomError.NotFoundError(`Admin not found`);
  }

  const { name, email, password } = req.body;
  //check if teacher already exists
  const teacherFound = await Teacher.findOne({ email });
  if (teacherFound) {
    throw new CustomError.BadRequestError("Teacher already employed");
  }

  //create
  const teacher = await Teacher.create({
    name,
    email,
    password,
  });

  //push teacher to admin
  admin.teachers.push(teacher._id);
  await admin.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    msg: "Teacher registered successfully",
    data: teacher,
  });
});

//@desc       Login Teacher
//@route      POST /api/teachers/login
//@access     Public
const loginTeacherCtrl = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Email and password are required");
  }
  const teacher = await Teacher.findOne({ email });
  if (!teacher || !(await teacher.verifyPassword(password))) {
    throw new CustomError.BadRequestError(`Invalid login credentials`);
  }
  attachCookiesToResponse({ res, user: teacher });

  res.status(StatusCodes.OK).json({
    msg: "Teacher logged in successfully",
    data: teacher,
  });
});

//@desc       Get all Teachers
//@route      GET /api/teachers/admin
//@access     Private admin only
const getAllTeachersAdminCtrl = asyncErrorHandler(async (req, res) => {
  //respond
  res.status(StatusCodes.OK).json(res.results);
});

//@desc       Get Teacher's Profile
//@route      GET /api/teachers/admin/:teacherId
//@access     Private admin only
const getSingleTeacherAdminCtrl = asyncErrorHandler(async (req, res) => {
  const id = req.params.teacherId;
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new CustomError.NotFoundError(`Teacher not found`);
  }
  res.status(StatusCodes.OK).json({
    msg: "teacher fetched successfully",
    data: teacher,
  });
});

//@desc       Get Teacher's Profile
//@route      GET /api/teachers
//@access     Private teacher only
const getTeacherProfileCtrl = asyncErrorHandler(async (req, res) => {
  const id = req.userAuth.userId;
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new CustomError.NotFoundError(`Teacher not found`);
  }
  res.status(StatusCodes.OK).json({
    msg: "Teacher's profile fetched successfully",
    data: teacher,
  });
});

//@desc      Update Teacher (name,email)
//@route     PUT/api/teachers/updateProfile
//@access    Private teacher only
const updateTeacherProfileCtrl = asyncErrorHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.userAuth.userId);
  if (!teacher) {
    throw new CustomError.NotFoundError(`teacher not found`);
  }

  const filterObj = filterReqObj(req.body, "name", "email");
  const updatedteacher = await Teacher.findByIdAndUpdate(
    req.userAuth.userId,
    filterObj,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({
    data: updatedteacher,
    message: "Teacher updated successfully",
  });
});

//@desc      Update teacher's Password
//@route     GET/api/teachers/updatePassword
//@access    Private teacher only
const updateTeacherPasswordCtrl = asyncErrorHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const teacher = await Teacher.findById(req.userAuth.userId);
  if (!(await teacher.verifyPassword(currentPassword))) {
    throw new CustomError.UnauthorizedError(
      "The Current password you provided is Wrong"
    );
  }
  teacher.password = newPassword;
  await teacher.save();
  attachCookiesToResponse({ res, user: teacher });
  res.status(StatusCodes.OK).json({
    msg: "password updated successfully",
    data: teacher,
  });
});

//@desc      Admin updating teacher profile
//@route     GET  /api/teachers/:teacherId/update/admin
//@access    Private admin only
const adminUpdateTeacherCtrl = asyncErrorHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //check if teacher exist
  const teacherFound = await Teacher.findById(req.params.teacherId);
  if (!teacherFound) {
    throw new CustomError.NotFoundError(`Teacher is not found`);
  }

  //check if teacher is withdraw
  if (teacherFound.isWitdrawn) {
    throw new CustomError.UnauthenticatedError(
      "Action denied, teacher is withdraw"
    );
  }

  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
  }
  //assign class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
  }
  //assign academicYear
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
  }
  //assign subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "teacher updated successfully",
    data: teacherFound,
  });
});

module.exports = {
  adminRegisterTeacherCtrl,
  loginTeacherCtrl,
  getAllTeachersAdminCtrl,
  getSingleTeacherAdminCtrl,
  getTeacherProfileCtrl,
  updateTeacherProfileCtrl,
  updateTeacherPasswordCtrl,
  adminUpdateTeacherCtrl,
};
