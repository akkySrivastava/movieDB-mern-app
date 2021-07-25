const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const File = require("../models/File");
const multer = require("multer");
const path = require("path");
const cloud = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const creds = require("../creds.json");

cloud.config({
  cloud_name: creds.CLOUD_NAME,
  api_key: creds.API_KEY,
  api_secret: creds.API_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "moviedb",
    public_id: (req, file) => file.filename,
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "movies",
    public_id: (req, file) => file.filename,
  },
});

const parser = multer({ storage: storage });
const videoParser = multer({ storage: videoStorage });

router.post("/video", async (req, res) => {
  parser.single(req.body.data);
  // cloud.uploader.upload(
  //   req.body.data,
  //   {
  //     resource_type: "video",
  //     public_id: "moviefile/movies",
  //     chunk_size: 6000000,
  //   },
  //   (error, result) => {
  //     console.log(error, result);
  //   }
  // );
  const file = req.file;
  console.log(file);
  console.log("uploading...");
  const fileData = new File({
    _id: new mongoose.Types.ObjectId(),
    originalName: file.originalName,
    mimeType: file.mimetype,
    filePath: file.path,
    size: file.size,
    createdAt: new Date().toISOString(),
  });

  await fileData
    .save()
    .then((doc) => {
      res.status(201).send({ fileId: doc._id });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "Error adding file" });
    });
});

router.post("/", parser.single("files"), async (req, res) => {
  const file = req.file;
  console.log("uploading...");
  const fileData = new File({
    _id: new mongoose.Types.ObjectId(),
    originalName: file.originalName,
    mimeType: file.mimetype,
    filePath: file.path,
    size: file.size,
    createdAt: new Date().toISOString(),
  });

  await fileData
    .save()
    .then((doc) => {
      res.status(201).send({ fileId: doc._id });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "Error adding file" });
    });
});

router.get("/", (req, res) => {
  const error = {
    message: "Error in retreiving the files",
    error: "Bad Request",
  };
  File.find({ createdBy: req.userId })
    .select({ originalName: 1, filePath: 1, mimeType: 1, size: 1 })
    .exec()
    .then((files) => {
      res.send(files);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(error);
    });
});

router.get("/:id", (req, res) => {
  const error = {
    message: "Error in retreiving the file",
    error: "Bad Request",
  };
  const id = mongoose.Types.ObjectId(req.params.id);
  // File.find({ createdBy: req.userId, _id: id })
  File.find({ _id: id })
    .select({ originalName: 1, filePath: 1, mimeType: 1, size: 1 })
    .exec()
    .then((files) => {
      res.send(files[0]);
    })
    .catch((er) => {
      console.log(err);
      res.status(500).send(error);
    });
});

module.exports = router;
