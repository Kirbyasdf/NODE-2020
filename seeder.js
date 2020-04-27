const dotevn = require("dotenv").config({ path: "./config/.env" });
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");

const Bootcamp = require("./models/Bootcamp.js");
const Course = require("./models/Course.js");
const User = require("./models/User.js");
const Review = require("./models/Review.js");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

///import

const importData = async () => {
  try {
    console.log("Importing data");
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data Imported....".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

///clear DB

const deleteData = async () => {
  try {
    console.log("Deleting data");
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed....".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// basic agrument scripting ex <node seeder.js -i> will  run importData
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
