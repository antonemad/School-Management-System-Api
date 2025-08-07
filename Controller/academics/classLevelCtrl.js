const ClassLevel = require("../../model/Academic/ClassLevel");
const Admin = require("../../model/Staff/Admin");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const CustomError = require("../../errors");
const { StatusCodes } = require("http-status-codes");

//@desc       Create Class level
//@route      POST /api/class-levels/
//@access     Private
const createClassLevelCtrl = asyncErrorHandler(async (req, res) => {
  const { name, description, createdBy } = req.body;
  //check if exist
  const classLevelFound = await ClassLevel.findOne({ name });
  if (classLevelFound) {
    throw new CustomError.BadRequestError(`Class Level already exists`);
  }

  //create
  const classLevel = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth.userId,
  });

  //Push Class Level into Admin
  const admin = await Admin.findById(req.userAuth.userId);
  admin.academicYears.push(classLevel._id);
  await admin.save();

  res.status(StatusCodes.OK).json({
    msg: "Class Created Successfully",
    classLevel,
  });
});

//@desc       Get All Classes Levels
//@route      GET /api/class-levels/
//@access     Private
const getClassLevelsCtrl = asyncErrorHandler(async (req, res) => {
  const classLevel = await ClassLevel.find();
  res.status(StatusCodes.OK).json({
    msg: "Classes Fetched Successfully",
    classLevel,
  });
});

//@desc       Get Single Class Level
//@route      GET /api/class-levels/:id
//@access     Private
const getSingleClassLevelCtrl = asyncErrorHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);
  if (!classLevel) {
    throw new CustomError.NotFoundError(`this Class Level is Not found`);
  }
  res.status(StatusCodes.OK).json({
    msg: "class fetched successfully",
    classLevel,
  });
});

//@desc       update class level
//@route      PUT /api/class-levels/:id
//@access     Private
const updateClassLevelCtrl = asyncErrorHandler(async (req, res) => {
  //check if name exist
  const { name, description } = req.body;
  const classLevelFound = await ClassLevel.findOne({
    name,
    _id: { $ne: req.params.id },
  });
  if (classLevelFound) {
    throw new CustomError.BadRequestError(`Class Level Already Exist !`);
  }

  //update
  const updatedClassLevel = await ClassLevel.findByIdAndUpdate(
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
  if (!updatedClassLevel) {
    throw new CustomError.NotFoundError(`Class level doesn't exist`);
  }

  //respond
  res.status(StatusCodes.OK).json({
    msg: "class level updated successfully",
    updatedClassLevel,
  });
});

//@desc       delete Academic Year
//@route      DELETE /api/academic-year/:id
//@access     Private
const deleteClassLevelCtrl = asyncErrorHandler(async (req, res) => {
  const classLevel = await ClassLevel.findByIdAndDelete(req.params.id);
  if (!classLevel) {
    throw new CustomError.NotFoundError(`Class level doesn't exist`);
  }

  //remove reference from admin.classLevels
  const admin = await Admin.findById(req.userAuth.userId);
  admin.classLevels = admin.classLevels.filter(
    (id) => id.toString() !== req.params.id
  );
  await admin.save();
  res.status(StatusCodes.OK).json({
    msg: "class level deleted successfully",
  });
});

module.exports = {
  createClassLevelCtrl,
  getClassLevelsCtrl,
  getSingleClassLevelCtrl,
  updateClassLevelCtrl,
  deleteClassLevelCtrl,
};
