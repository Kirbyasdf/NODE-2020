const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  HTPPADAPTER: "https",
  apiKey: process.env.GEO_KEY,
  fromatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
