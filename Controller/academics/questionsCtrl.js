const Question = require("../../model/Academic/Questions");
const Teacher = require("../../model/Staff/Teacher");
const Exam = require("../../model/Academic/Exam");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create Question
//@route      GET /api/questions/:examId
//@access     Private Teachers only
const createQuestionCtrl = asyncErrorHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  //find the exam
  const examFound = await Exam.findById(req.params.examId);
  if (!examFound) {
    throw new CustomError.NotFoundError(`Exam not found`);
  }

  //check if quesion exists
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    throw new CustomError.BadRequestError(`Question already exists`);
  }

  //create Question
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: req.userAuth.userId,
  });

  //push question to exam
  examFound.questions.push(questionCreated?._id);
  await examFound.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    msg: "question created successfully",
    data: questionCreated,
  });
});

//@desc       Get All Questions
//@route      GET /api/questions
//@access     Private Teachers only
const getQuestionsCtrl = asyncErrorHandler(async (req, res) => {
  const questions = await Question.find({});
  res.status(StatusCodes.OK).json({
    msg: "Questions fetched successfully",
    data: questions,
  });
});

//@desc       Get Single Questions
//@route      GET /api/questions/:id
//@access     Private Teachers only
const getSingleQuestionCtrl = asyncErrorHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    throw new CustomError.NotFoundError(`Question is not found`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Question fetched successfully",
    data: question,
  });
});

//@desc       Update Questions
//@route      GET /api/questions/:id
//@access     Private Teachers only
const updateQuestionCtrl = asyncErrorHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;
  const questionFound = await Question.findOne({
    question,
    _id: { $ne: req.params.id },
  });
  if (questionFound) {
    throw new CustomError.BadRequestError(`Question already exist`);
  }

  //update
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Question updated successfully",
    data: updatedQuestion,
  });
});

module.exports = {
  createQuestionCtrl,
  getQuestionsCtrl,
  getSingleQuestionCtrl,
  updateQuestionCtrl,
};
