const Student = require("../../model/Academic/Student");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");

const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const { attachCookiesToResponse } = require("../../utils");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const filterReqObj = require("../../utils/filterReqObj");
const Admin = require("../../model/Staff/Admin");

//@desc       Admin Register Student
//@route      POST /api/students/admin/register
//@access     Private
const adminRegisterStudentCtrl = asyncErrorHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth.userId);
  if (!admin) {
    throw new CustomError.NotFoundError(`Admin not found`);
  }

  const { name, email, password } = req.body;
  //check if teacher already exists
  const studentFound = await Student.findOne({ email });
  if (studentFound) {
    throw new CustomError.BadRequestError("Student already employed");
  }

  //create
  const student = await Student.create({
    name,
    email,
    password,
  });

  //push student to admin
  admin.students.push(student._id);
  await admin.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    msg: "Student registered successfully",
    data: student,
  });
});

//@desc       Student Login
//@route      POST /api/students/admin/register
//@access     Private

const loginStudentCtrl = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Invalid login credentials");
  }
  const student = await Student.findOne({ email });
  if (!student || !(await student.verifyPassword(password))) {
    throw new CustomError.BadRequestError(`Invalid login credentials`);
  }
  attachCookiesToResponse({ res, user: student });

  res.status(StatusCodes.OK).json({
    msg: "Student logged in successfully",
    data: student,
  });
});

//@desc       Student Profile
//@route      GET /api/students/profile
//@access     Private Students Only
const getStudentProfile = asyncErrorHandler(async (req, res) => {
  const student = await Student.findById(req.userAuth.userId).populate(
    "examResults"
  );
  if (!student) {
    throw new CustomError.NotFoundError(`Student not found`);
  }

  //get student profile
  const studentProfile = {
    name: student?.name,
    studentId: student?.studentId,
    email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program,
    dateAdmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended,
    isWithdrawn: student?.isWithdrawn,
    prefectName: student?.prefectName,
  };
  //get student exam results
  const examResult = student?.examResults;
  //current exam
  const currentExamResult = examResult[examResult.length - 1];
  //check if exam is published
  const isPublished = currentExamResult.isPublished;

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Student's profile fetched successfully",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
  });
});

//@desc       Get all students
//@route      GET /api/students/admin
//@access     Private Admin Only
const getAllStudentsByAdmin = asyncErrorHandler(async (req, res) => {
  const students = await Student.find({});
  res.status(StatusCodes.OK).json({
    msg: "Students fetched successfully",
    data: students,
  });
});

//@desc       Get Single students
//@route      GET /api/students/:id/admin
//@access     Private Admin Only
const getSingleStudentByAdmin = asyncErrorHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new CustomError.NotFoundError(`Student not found`);
  }
  res.status(StatusCodes.OK).json({
    msg: "Student fetched successfully",
    data: student,
  });
});

//@desc       Update students
//@route      PUT /api/students
//@access     Private Students Only
const updateStudentProfileCtrl = asyncErrorHandler(async (req, res) => {
  const student = await Student.findById(req.userAuth.userId);
  if (!student) {
    throw new CustomError.NotFoundError(`teacher not found`);
  }

  const filterObj = filterReqObj(req.body, "name", "email");
  const updatedStudent = await Student.findByIdAndUpdate(
    req.userAuth.userId,
    filterObj,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({
    data: updatedStudent,
    message: "Student updated successfully",
  });
});

//@desc      Update student's Password
//@route     GET/api/students/updatePassword
//@access    Private Student only
const updateStudentPasswordCtrl = asyncErrorHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const student = await Student.findById(req.userAuth.userId);
  if (!(await student.verifyPassword(currentPassword))) {
    throw new CustomError.UnauthorizedError(
      "The Current password you provided is Wrong"
    );
  }
  student.password = newPassword;
  await student.save();
  attachCookiesToResponse({ res, user: student });
  res.status(StatusCodes.OK).json({
    msg: "password updated successfully",
    data: student,
  });
});

//@desc      ِAdmin Updating Students
//@route     PUT/api/students/:id/update/admin
//@access    Private Admin only
const adminUpdateStudent = asyncErrorHandler(async (req, res) => {
  const { classLevels, program, academicYear, name, email, prefectName } =
    req.body;
  //find the student by id
  const studentFound = await Student.findById(req.params.id);
  if (!studentFound) {
    throw new CustomError.NotFoundError(`Student not found`);
  }

  //update
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        program,
        academicYear,
        name,
        email,
        prefectName,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Student updated successfully",
    data: updatedStudent,
  });
});

//@desc      ِStudent taking Exams
//@route     PUT/api/students/exam /exams:Id/write
//@access    Private Students only
const writeExamCtrl = asyncErrorHandler(async (req, res) => {
  //get student
  const studentFound = await Student.findById(req.userAuth.userId);
  if (!studentFound) {
    throw new CustomError.NotFoundError(`Student not found`);
  }

  if (studentFound.isWithdrawn || studentFound.isSuspended) {
    throw new CustomError.BadRequestError(
      `You are suspended/withdrawn, you can't take this exam `
    );
  }

  //get exam
  const examFound = await Exam.findById(req.params.examId)
    .populate("questions")
    .populate("academicTerm");

  if (!examFound) {
    throw new CustomError.NotFoundError(`Exam not found`);
  }

  //get questions
  const questions = examFound?.questions;

  //get Student's answers
  const studentAnswers = req.body.answers;

  //check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    throw new CustomError.BadRequestError(
      `You have to answer all the questions `
    );
  }

  //check if student has already taken the exam
  const studentFoundInResults = await ExamResult.findOne({
    studentId: studentFound.studentId,
    exam: examFound._id,
  });
  if (studentFoundInResults) {
    throw new CustomError.BadRequestError(`You already written this exam`);
  }

  //Build report Object
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let status = ""; //failed/passed
  let remarks = "";
  let grade = 0;
  let score = 0;
  let answeredQuestions = [];

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the question
    const question = questions[i];
    //check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctAnswers++;
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++;
    }
  }

  //calculate reports
  grade = (correctAnswers / questions.length) * 100;
  answeredQuestions = questions.map((question) => {
    return {
      question: question.question,
      correctAnswer: question.correctAnswer,
      isCorrect: question.isCorrect,
    };
  });

  //calculate status
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  //Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  //Generate Exam Results
  const examResults = await ExamResult.create({
    studentId: studentFound?.studentId,
    exam: examFound?._id,
    grade,
    score,
    status,
    remarks,
    classLevels: examFound?.classLevel,
    academicTerm: examFound?.academicTerm,
    academicYear: examFound?.academicYear,
    answeredQuestions,
  });

  //push exam result into students
  studentFound.examResults.push(examResults._id);
  await studentFound.save();

  //Promoting Student
  if (examFound.academicTerm.name === "3rd term" && status === "Pass") {
    //promote student to level200
    if (studentFound.currentClassLevel === "Level 100") {
      //promoting to level 200
      studentFound.classLevels.push("Level 200");
      studentFound.currentClassLevel = "Level 200";
      studentFound.isPromotedToLevel200 = true;
    } else if (studentFound.currentClassLevel === "Level 200") {
      //promoting to level 300
      studentFound.classLevels.push("Level 300");
      studentFound.currentClassLevel = "Level 300";
      studentFound.isPromotedToLevel300 = true;
    } else if (studentFound.currentClassLevel === "Level 300") {
      //promoting to level 400
      studentFound.classLevels.push("Level 400");
      studentFound.currentClassLevel = "Level 400";
      studentFound.isPromotedToLevel400 = true;
    } else if (studentFound.currentClassLevel === "Level 400") {
      //promoting to graduate
      studentFound.isGraduated = true;
      studentFound.yearGraduated = new Date();
    }
    await studentFound.save();
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "You have submitted your exam. Check later for the results",
  });
});

module.exports = {
  adminRegisterStudentCtrl,
  loginStudentCtrl,
  getStudentProfile,
  getAllStudentsByAdmin,
  getSingleStudentByAdmin,
  updateStudentProfileCtrl,
  updateStudentPasswordCtrl,
  adminUpdateStudent,
  writeExamCtrl,
};
