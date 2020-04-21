const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // copy req.query
  const reqQuery = { ...req.query };

  //filter query for field select for mongodb lang query use

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryString = JSON.stringify(reqQuery);
  //create operators for mongoose query lang
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // greater than, greater than or equal and return the match where// double $$ is just string interp.

  query = model.find(JSON.parse(queryString)).populate("courses");

  //utilize the select field in mongo

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //utilize sort field in mongo

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //pagination
  //take in page(base 10) or default page 1
  const page = parseInt(req.query.page, 10) || 1;
  //limit results to 25 per page
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate();
  }

  const results = await query;

  //pagination result ...gives reference to the front end

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
