const Bootcamp = require("../models/Bootcamp.js");

// @desc       get all bootcamp
// @routes     GET /api/v1/bootcamps/
// @access     public

getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({
        success: true,
        bootcampCount: bootcamps.length,
        data: bootcamps,
      });
  } catch (err) {
    res.status(400).json({ sucess: false, data: err.message });
  }
};

// @desc       get 1 bootcamp
// @routes     GET /api/v1/bootcamps/:id
// @access     public
getBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findById(id);
    console.log(bootcamp);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ sucess: false, message: `No Bootcamp with id: ${id}` });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

// @desc       create bootcamp
// @routes     POST /api/v1/bootcamps/
// @access     private

createBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc       update bootcamp
// @routes     PATCH /api/v1/bootcamps/:id
// @access     private

updateBootcamps = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res
        .status(400)
        .json({ sucess: false, message: `No Bootcamp with  id: ${id}` });
    }
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(200).json({ sucess: false, message: err.message });
  }
};

// @desc       update bootcamp
// @routes     DEL /api/v1/bootcamps/:id
// @access     private

deleteBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ sucess: false, message: `No Bootcamp with id: ${id}` });
    }
    res.status(200).json({
      success: true,
      message: `Bootcamp: "${bootcamp.name}" was deleted id: ${bootcamp._id}`,
    });
  } catch (err) {
    res.status(200).json({ sucess: false, message: err.message });
  }
};

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp,
};
