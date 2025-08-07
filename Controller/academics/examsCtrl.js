const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create Exam
//@route      POST /api/exam/
//@access     Private teachers Only
const createExam = asyncErrorHandler(async (req, res) => {
  const {
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
  } = req.body;

  //find teacher
  const teacherFound = await Teacher.findById(req.userAuth.userId);
  if (!teacherFound) {
    throw new CustomError.NotFoundError("Teacher Not Found");
  }

  // exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new CustomError.BadRequestError(`Exam already exists`);
  }

  //create
  const examsCreated = new Exam({
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
    createdBy: req.userAuth.userId,
  });

  //push the exam into teacher
  teacherFound.examsCreated.push(examsCreated._id);
  //save exam and teacher
  await examsCreated.save();
  await teacherFound.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    msg: "Exam Created",
    data: examsCreated,
  });
});

//@desc       Get Exam
//@route      GET /api/exam/
//@access     Private teachers Only
const getExams = asyncErrorHandler(async (req, res) => {
  const exams = await Exam.find({}).populate({
    path: "questions",
    populate: {
      path: "createdBy",
    },
  });

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Exams fetched successfully",
    data: exams,
  });
});

//@desc       Create Exam
//@route      POST /api/exam/:id
//@access     Private teachers Only
const getSingleExam = asyncErrorHandler(async (req, res) => {
  const examFound = await Exam.findById(req.params.id);
  if (!examFound) {
    throw new CustomError.NotFoundError(`Exam not found`);
  }
  res.status(StatusCodes.OK).json({
    msg: "Exam fetched successfully",
    data: examFound,
  });
});

//@desc       Update Exam
//@route      PUT /api/exam/:id
//@access     Private teachers Only
const updateExam = asyncErrorHandler(async (req, res) => {
  const {
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
  } = req.body;

  //check name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new CustomError.BadRequestError(`Exam already exists`);
  }

  //update
  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      academicYear,
      classLevel,
      duration,
      examDate,
      examTime,
      examType,
      subject,
      program,
      createdBy: req.userAuth.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  //check if exam exists
  if (!exam) {
    throw new CustomError.NotFoundError(`Exam not found`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "exam updated successfully",
    data: exam,
  });
});

module.exports = { createExam, getExams, getSingleExam, updateExam };
