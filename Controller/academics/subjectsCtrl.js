const Subject = require("../../model/Academic/Subject");
const Program = require("../../model/Academic/Program");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create Subject
//@route      POST /api/subjects/:programId
//@access     Private
const createSubjectCtrl = asyncErrorHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  //find the program
  const programFound = await Program.findById(req.params.programId);
  if (!programFound) {
    throw new CustomError.NotFoundError(`Program not found`);
  }
  //check if subject already exist
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new CustomError.BadRequestError(`Subject already exist`);
  }

  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth.userId,
  });

  //push subject to the program
  programFound.subjects.push(subjectCreated._id);
  await programFound.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    message: "Subject created successfully",
    subject: subjectCreated,
  });
});

//@desc       Get All Subjects
//@route      GET /api/subjects/
//@access     Private
const getSubjectsCtrl = asyncErrorHandler(async (req, res) => {
  const subject = await Subject.find();
  res.status(StatusCodes.OK).json({
    msg: "Subjects fetched successfully",
    subject,
  });
});

//@desc       Get Single Subject
//@route      GET /api/subjects/:id
//@access
const getSingleSubjectCtrl = asyncErrorHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new CustomError.NotFoundError(`Subject not found`);
  }
  res.status(StatusCodes.OK).json({
    subject,
  });
});

//@desc       update Subject
//@route      PUT /api/subjects/:id
//@access     Private
const updateSubjectCtrl = asyncErrorHandler(async (req, res) => {
  //check if name exist
  const { name, description, academicTerm } = req.body;
  const subjectFound = await Subject.findOne({
    name,
    _id: { $ne: req.params.id },
  });
  if (subjectFound) {
    throw new CustomError.BadRequestError(`Subject Already Exist !`);
  }

  //update
  const updatedSubject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedSubject) {
    throw new CustomError.NotFoundError(`Subject doesn't exist`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "subject updated successfully",
    updatedSubject,
  });
});

//@desc     Delete Subject
//@route    DELETE /api/subjects/:id
//@access   Private
const deleteSubjectCtrl = asyncErrorHandler(async (req, res) => {
  // Find and delete the subject
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    throw new CustomError.NotFoundError("Subject doesn't exist");
  }

  // Remove the subject from any programs that include it
  await Program.updateMany(
    { subjects: subject._id },
    { $pull: { subjects: subject._id } }
  );

  // Send response
  res.status(StatusCodes.OK).json({
    msg: "Subject deleted successfully",
  });
});

module.exports = {
  createSubjectCtrl,
  getSubjectsCtrl,
  getSingleSubjectCtrl,
  updateSubjectCtrl,
  deleteSubjectCtrl,
};
