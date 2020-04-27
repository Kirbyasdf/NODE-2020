const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utilities/nodeGeocoder.js");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"], //put in array to get custom message
      unique: true,
      trim: true,
      maxlength: [50, "name can not be > 50 char"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "please add a description"], //put in array to get custom message

      maxlength: [500, "name can not be > 500 char"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        //means only values allowed in careers
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//some notes ... use a function not an arrow function due to scope
// running all of this before on save
//console.log(this) for full keys

// Create slug from the name

BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocoder
// https://github.com/nchaulet/node-geocoder

BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // The client already gives us an address so we do not want to save it
  this.address = undefined;
  next();
});

// Cascade delete courses when bootcamp is deleted
//* must be pre!

BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses being remove from bootcamp: ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
});

// Reverse populate with virtuals

BootcampSchema.virtual("course", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);

// // Cascade delete courses when a bootcamp is deleted
// BootcampSchema.pre("remove", async function (next) {
//   console.log(`Courses being removed from bootcamp ${this._id}`);
//   await this.model("Course").deleteMany({ bootcamp: this._id });
//   next();
// });

// // Reverse populate with virtuals
// BootcampSchema.virtual("courses", {
//   ref: "Course",
//   localField: "_id",
//   foreignField: "bootcamp",
//   justOne: false,
// });
