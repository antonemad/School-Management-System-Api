const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

//model
const advancedResults = (model, populate) => {
  return async (req, res, next) => {
    let DocQuery = model.find();
    //convert query string to numbe
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    if (limit <= 0) {
      throw new CustomError.BadRequestError(`Limit must be greater than 0`);
    }

    //populate
    if (populate) {
      DocQuery = DocQuery.populate(populate);
    }

    const totalDocs = await model.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);
    if ((page > totalPages && totalTeachers > 0) || skip >= totalDocs) {
      throw new CustomError.NotFoundError(`This page does not exist`);
    }

    //ececute query
    const docs = await DocQuery.find({}).skip(skip).limit(limit);

    //pagination result
    const pagination = {
      currentPage: page,
      totalPages,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    res.results = {
      results: docs.length,
      pagination,
      data: docs,
    };

    next();
  };
};

module.exports = advancedResults;
