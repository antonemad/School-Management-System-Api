const Program = require("../../model/Academic/Program");
const Admin = require("../../model/Staff/Admin");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create program
//@route      POST /api/programs/
//@access     Private
const createProgramCtrl = asyncErrorHandler(async (req, res) => {
  const { name, description } = req.body;
  //check if exist
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new CustomError.BadRequestError(`Program already exists`);
  }
  //create
  const program = await Program.create({
    name,
    description,
    createdBy: req.userAuth.userId,
  });
  //Push Program into Admin
  const admin = await Admin.findById(req.userAuth.userId);
  admin.programs.push(program._id);
  await admin.save();

  res.status(StatusCodes.OK).json({
    msg: "program created successfully",
    program,
  });
});

//@desc       Get All Programs
//@route      GET /api/programs/
//@access     Private
const getProgramsCtrl = asyncErrorHandler(async (req, res) => {
  const programs = await Program.find();
  res.status(StatusCodes.OK).json({
    programs,
  });
});

//@desc       Get Single Program
//@route      GET /api/programs/:id
//@access
const getSingleProgramCtrl = asyncErrorHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);
  if (!program) {
    throw new CustomError.NotFoundError(`this Program is Not found`);
  }
  res.status(StatusCodes.OK).json({
    program,
  });
});

//@desc       update Program
//@route      PUT /programs/:id
//@access     Private
const updateProgramCtrl = asyncErrorHandler(async (req, res) => {
  //check if name exist
  const { name, description } = req.body;
  const programFound = await Program.findOne({
    name,
    _id: { $ne: req.params.id },
  });
  if (programFound) {
    throw new CustomError.BadRequestError(`Program Already Exist !`);
  }

  //update
  const updatedProgram = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedProgram) {
    throw new CustomError.NotFoundError(`Program doesn't exist`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "program updated successfully",
    updatedProgram,
  });
});

//@desc       delete program
//@route      DELETE /api/program/:id
//@access     Private
const deleteProgramCtrl = asyncErrorHandler(async (req, res) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) {
    throw new CustomError.NotFoundError(`Program doesn't exist`);
  }

  //remove reference from admin.programs
  const admin = await Admin.findById(req.userAuth.userId);
  admin.programs = admin.programs.filter(
    (id) => id.toString() !== req.params.id
  );
  await admin.save();

  //respond
  res.status(StatusCodes.OK).json({
    msg: "program deleted successfully",
  });
});

module.exports = {
  createProgramCtrl,
  getProgramsCtrl,
  getSingleProgramCtrl,
  updateProgramCtrl,
  deleteProgramCtrl,
};
