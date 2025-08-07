const AcademicTerm = require("../../model/Academic/AcademicTerm");
const Admin = require("../../model/Staff/Admin");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create Academic Term
//@route      POST /api/academic-term/
//@access     Private
const createAcademicTermCtrl = asyncErrorHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  //check if exists
  const academicTermFound = await AcademicTerm.findOne({ name });
  if (academicTermFound) {
    throw new CustomError.BadRequestError(`Academic Term already exists`);
  }
  //create
  const academicTerm = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth.userId,
  });

  //push academic Term into admin
  const admin = await Admin.findById(req.userAuth.userId);
  admin.academicTerms.push(academicTerm._id);
  await admin.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    msg: "Aademic Term Created Successfully",
    academicTerm,
  });
});

//@desc       Get All Academic Term
//@route      GET /api/academic-term/
//@access     Private
const getAcademicTermsCtrl = asyncErrorHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.find({});
  res.status(StatusCodes.OK).json({
    msg: "Academic Terms fetched successfully",
    academicTerms,
  });
});

//@desc       Get Sinle Academic Term
//@route      GET /api/academic-term/:id
//@access     Private
const getSingleAcademictermCtrl = asyncErrorHandler(async (req, res) => {
  const academicTerm = await AcademicTerm.findById(req.params.id);
  if (!academicTerm) {
    throw new CustomError.NotFoundError("This Academic Term is Not Found");
  }
  res.status(StatusCodes.OK).json({
    academicTerm,
  });
});

//@desc       Update Academic Term
//@route      PUT /api/academic-term/:id
//@access     Private
const updateAcademicTermCtrl = asyncErrorHandler(async (req, res) => {
  // Check if another term with the same name exists
  const { name, description, duration } = req.body;
  const academicTermFound = await AcademicTerm.findOne({
    name,
    _id: { $ne: req.params.id },
  });
  if (academicTermFound) {
    throw new CustomError.BadRequestError(`Academic term already exist`);
  }

  //update
  const updatedAcademicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedAcademicTerm) {
    throw new CustomError.NotFoundError(`Academic term dosen't exist`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Academic term updated successfully",
    updatedAcademicTerm,
  });
});

//@desc       Delete Academic Term
//@route      delete /api/academic-term/:id
//@access     Private
const deleteAcademicTermCtrl = asyncErrorHandler(async (req, res) => {
  const academicTerm = await AcademicTerm.findByIdAndDelete(req.params.id);
  if (!academicTerm) {
    throw new CustomError.BadRequestError(`Academic term doesn't exist`);
  }

  //remove reference from admin.academicYears
  const admin = await Admin.findById(req.userAuth.userId);
  if (!admin) {
    throw new CustomError.NotFoundError(`Admin not found`);
  }
  admin.academicTerms = admin.academicTerms.filter(
    (id) => id.toString() !== req.params.id
  );
  await admin.save();

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Academic term deleted successfully",
  });
});

module.exports = {
  createAcademicTermCtrl,
  getAcademicTermsCtrl,
  getSingleAcademictermCtrl,
  updateAcademicTermCtrl,
  deleteAcademicTermCtrl,
};
