const express = require("express");
const mongoose = require("mongoose");
const MovieDB = require("../models/MovieDB");
const router = express.Router();

router.post("/", async (req, res) => {
  if (req.body.thumbnail) {
    req.body.thumbnail = mongoose.Types.ObjectId(req.body.thumbnail);
  }

  const movieData = new MovieDB({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.movieName,
    yearReleased: req.body.yearReleased,
    language: req.body.language,
    thumbnail: req.body.thumbnail,
    movieUrl: req.body.movieUrl,
  });

  await movieData
    .save()
    .then((doc) => {
      res.status(201).send(doc);
    })
    .catch((err) => {
      console.log(err);
      res.send(400).send({
        message: "Error adding movie",
      });
    });
});

router.get("/", async (req, res) => {
  const error = {
    message: "Error in retreiving the files",
    error: "Bad Request",
  };

  MovieDB.aggregate([
    {
      $lookup: {
        from: "files",
        let: { thumbnail: "$thumbnail" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$thumbnail"],
              },
            },
          },
          {
            $project: {
              filePath: 1,
              _id: 1,
              originalName: 1,
            },
          },
        ],
        as: "thumbnailUrl",
      },
    },
    {
      $unwind: {
        path: "$thumbnailUrl",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        __v: 0,
      },
    },
  ])
    .exec()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      console.log("Error: ", err);
      res.status(400).send(error);
    });
});

module.exports = router;
