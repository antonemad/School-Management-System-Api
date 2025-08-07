const YearGroup = require("../../model/Academic/YearGroup");
const Admin = require("../../model/Staff/Admin");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create year group
//@route      POST /api/year-group/
//@access     Private
const createYearGroupCtrl = asyncErrorHandler(async (req, res) => {
  const { name, academicYear } = req.body;
  //check if yearGroup exist
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new CustomError.BadRequestError(`Year group already exist`);
  }

  //create
  const yearGroup = await YearGroup.create({
    name,
    createdBy: req.userAuth.userId,
    academicYear,
  });

  //push year group into admin
  const admin = await Admin.findById(req.userAuth.userId);
  if (!admin) {
    throw new CustomError.NotFoundError(`Admin not found`);
  }
  admin.yearGroups.push(yearGroup._id);
  await admin.save();

  //respond
  res.status(StatusCodes.CREATED).json({
    msg: "year group created successfully",
    data: yearGroup,
  });
});

//@desc       Get All year groups
//@route      GET /api/year-group/
//@access     Private
const getYearGroupsCtrl = asyncErrorHandler(async (req, res) => {
  const yearGroups = await YearGroup.find({});
  res.status(StatusCodes.OK).json({
    msg: "Year groups fetched successfully",
    data: yearGroups,
  });
});

//@desc       Get Single year group
//@route      GET /api/year-group/:id
//@access     Private
const getSingleYearGroupCtrl = asyncErrorHandler(async (req, res) => {
  const yearGroup = await YearGroup.findById(req.params.id);
  if (!yearGroup) {
    throw new CustomError.NotFoundError("This year group is not found");
  }
  res.status(StatusCodes.OK).json({
    data: yearGroup,
  });
});

//@desc       Update year group
//@route      PUT /api/year-group/:id
//@access     Private
const updateYearGroupCtrl = asyncErrorHandler(async (req, res) => {
  // Check if another year group with the same name exists
  const { name, academicYear } = req.body;
  const yearGroupFound = await YearGroup.findOne({
    name,
    _id: { $ne: req.params.id },
  });
  if (yearGroupFound) {
    throw new CustomError.BadRequestError(`Year group already exist`);
  }

  //update
  const updatedYearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedYearGroup) {
    throw new CustomError.NotFoundError(`Year group dosen't exist`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "Year group updated successfully",
    updatedYearGroup,
  });
});

//@desc       delete year group
//@route      DELETE /api/year-group/:id
//@access     Private
const deleteYearGroupCtrl = asyncErrorHandler(async (req, res) => {
  const yearGroup = await YearGroup.findByIdAndDelete(req.params.id);
  if (!yearGroup) {
    throw new CustomError.NotFoundError(`Year group dosen't exist`);
  }

  //remove reference from admin.academicYears
  const admin = await Admin.findById(req.userAuth.userId);
  if (!admin) {
    throw new CustomError.NotFoundError(`Admin not found`);
  }
  admin.yearGroups = admin.yearGroups.filter(
    (id) => id.toString() !== req.params.id
  );
  await admin.save();
  res.status(StatusCodes.OK).json({
    msg: "Year group deleted successfully",
  });
});

module.exports = {
  createYearGroupCtrl,
  getYearGroupsCtrl,
  getSingleYearGroupCtrl,
  updateYearGroupCtrl,
  deleteYearGroupCtrl,
};
