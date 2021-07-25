const mongoose = require("mongoose");

const movieDBSchema = new mongoose.Schema({
  name: String,
  yearReleased: String,
  language: String,
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  movieUrl: {
    type: String,
  },
  uploaded: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("movieDB", movieDBSchema);
