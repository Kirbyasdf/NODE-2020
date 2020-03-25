// @desc       get all bootcamp
// @routes     get /api/v1/bootcamps/
// @access     public

getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: "show all bootcamps" });
};

// @desc       get 1 bootcamp
// @routes     get /api/v1/bootcamps/
// @access     public
getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: ` show ${req.params.id} ` });
};

// @desc       create bootcamp
// @routes     PUT /api/v1/bootcamps/
// @access     private

createBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: "create a bootcamp" });
};

// @desc       update bootcamp
// @routes     PATCH /api/v1/bootcamps/:id
// @access     private

updateBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: ` Update ${req.params.id} ` });
};

// @desc       update bootcamp
// @routes     DEL /api/v1/bootcamps/:id
// @access     private

deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: "delete bootcamp" });
};

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp
};
