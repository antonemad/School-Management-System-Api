const ExamResult = require("../../model/Academic/ExamResults");
const Student = require("../../model/Academic/Student");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Exam Result Checking
//@route      GET /api/exam-results/:id/checking
//@access     Private Students Only
const checkExamResult = asyncErrorHandler(async (req, res) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth.userId);
  if (!studentFound) {
    throw new CustomError.NotFoundError(`Student not found`);
  }

  //find the exam results
  const examResult = await ExamResult.findOne({
    studentId: studentFound?.studentId,
    exam: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");

  //check if exam is published
  if (examResult?.isPublished === false) {
    throw new CustomError.BadRequestError(
      `Exam result is not available, check out later`
    );
  }

  res.status(StatusCodes.OK).json({
    msg: "Exam result",
    student: studentFound,
    data: examResult,
  });
});

//@desc       Get All Exam Results (name,id)
//@route      GET /api/exam-results
//@access     Private Students Only
const getAllExamResults = asyncErrorHandler(async (req, res) => {
  const results = await ExamResult.find({}).select("exam").populate("exam");
  res.status(StatusCodes.OK).json({
    msg: "Exams Results fetched successfully",
    data: results,
  });
});

//@desc       Admin publish exam result
//@route      PUT /api/exam-results/:id/admin-toggle-publish
//@access     Private Admin Only
const adminToggleExamResult = asyncErrorHandler(async (req, res) => {
  //find the exam result
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    throw new CustomError.NotFoundError(`Exam result not found`);
  }

  //update
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Exam result updated",
    data: publishResult,
  });
});

module.exports = { checkExamResult, getAllExamResults, adminToggleExamResult };
