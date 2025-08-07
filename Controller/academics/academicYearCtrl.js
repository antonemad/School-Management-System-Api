const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create Academic Year
//@route      POST /api/academic-year/
//@access     Private
const createAcademicYear = asyncErrorHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;
  //check if exist
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    throw new CustomError.BadRequestError(`Academic year already exists`);
  }
  //create
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.userAuth.userId,
  });
  //Push Academic Year into Admin
  const admin = await Admin.findById(req.userAuth.userId);
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();

  res.status(StatusCodes.OK).json({
    msg: "Academic year created successfully",
    academicYearCreated,
  });
});

//@desc       Get All Academic Years
//@route      GET /api/academic-year/
//@access     Private
const getAcademicYears = asyncErrorHandler(async (req, res) => {
  const academicYears = await AcademicYear.find();
  res.status(StatusCodes.OK).json({
    academicYears,
  });
});

//@desc       Get Academic Year
//@route      GET /api/academic-year/:id
//@access
const getSingleAcademicYear = asyncErrorHandler(async (req, res) => {
  const academicYear = await AcademicYear.findById(req.params.id);
  if (!academicYear) {
    throw new CustomError.NotFoundError(`this academic year is not found`);
  }
  res.status(StatusCodes.OK).json({
    academicYear,
  });
});

//@desc       update Academic Year
//@route      PUT /api/academic-year/:id
//@access     Private
const updateAcademicYear = asyncErrorHandler(async (req, res) => {
  // Check if another academic year with the same name exists
  const { name, fromYear, toYear } = req.body;
  const academicYearFound = await AcademicYear.findOne({
    name,
    _id: { $ne: req.params.id },
  });

  if (academicYearFound) {
    throw new CustomError.BadRequestError(`Academic year already exist !`);
  }

  //update
  const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    {
      name,
      fromYear,
      toYear,
      createdBy: req.userAuth.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedAcademicYear) {
    throw new CustomError.NotFoundError(`Academic year dosen't exists`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Academic year updated successfully",
    updatedAcademicYear,
  });
});

//@desc       delete Academic Year
//@route      DELETE /api/academic-year/:id
//@access     Private
const deleteAcademicYear = asyncErrorHandler(async (req, res) => {
  const academicYear = await AcademicYear.findByIdAndDelete(req.params.id);
  if (!academicYear) {
    throw new CustomError.BadRequestError(`Academic year dosen't exist`);
  }

  //remove reference from admin.academicYears
  const admin = await Admin.findById(req.userAuth.userId);
  if (!admin) {
    throw new CustomError.NotFoundError(`Admin not found`);
  }
  admin.academicYears = admin.academicYears.filter(
    (id) => id.toString() !== req.params.id
  );
  await admin.save();
  res.status(StatusCodes.OK).json({
    msg: "Academic year deleted successfully",
  });
});

module.exports = {
  createAcademicYear,
  getAcademicYears,
  getSingleAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
