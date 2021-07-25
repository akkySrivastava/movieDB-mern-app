import CloudUpload from "@material-ui/icons/CloudUpload";
import React, { useRef, useState } from "react";
import "./css/AddMovie.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
// import cloudinary from "cloudinary-react";
// import { Cloud } from "cloudinary-core";
import CircularProgress from "@material-ui/core/CircularProgress";
import check from "./img/checked.gif";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function AddMovie() {
  const history = useHistory();
  const imageRef = useRef(null);
  const { result, uploader } = useDisplayImage();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [movie, setMovie] = useState(null);
  const [thumbnailFileId, setThumbnailFileId] = useState(null);
  const [img, setImg] = useState(false);
  const [video, setVideo] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = (e) => {
    let maxSize = 2 * 1024; //in kb
    if (e.target.files[0]) {
      let fileSize = e.target.files[0].size / 1024;
      if (fileSize > maxSize) {
        alert("Maximum file size exceeded for thumbnail");
        return false;
      } else {
        setThumbnail(e.target.files[0]);
        uploader(e);
        setImg(true);
      }
    }
  };

  // const handleVideoUpload = (e) => {
  //   let maxSize = 500 * 1024; // 500mb
  //   if (e.target.files[0]) {
  //     let fileSize = e.target.files[0].size / 1024;
  //     if (fileSize > maxSize) {
  //       alert("Video file size exceeded");
  //       return false;
  //     } else {
  //       setMovie(e.target.files[0]);
  //       setVideo(true);
  //     }
  //   }
  // };

  function useDisplayImage() {
    const [result, setResult] = useState("");
    function uploader(e) {
      const imgFile = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        setResult(e.target.result);
      });
      reader.readAsDataURL(imgFile);
    }
    return { result, uploader };
  }
  const handleThumbnail = () => {
    if (!img) document.getElementById("thumbnail").click();
  };

  // const handleMovie = () => {
  //   if (!video) document.getElementById("movies").click();
  // };
  let uploadedPercent = 0;
  const thumbnailFinalUpload = async () => {
    if (thumbnail) {
      setIsUploading(true);
    }
    const config = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        uploadedPercent = Math.floor((loaded * 100) / total);

        if (percent <= 100) {
          setPercent(uploadedPercent);
        }
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
    const formData = new FormData();
    formData.append("files", thumbnail);
    const fileID = await axios
      .post("/api/file", formData, config)
      .then((res) => {
        setPercent(uploadedPercent);
        alert("Thumbnail uploaded successfully");
        return res.data.fileId;
      })
      .catch((error) => console.log(error));
    if (fileID && fileID !== "") {
      setThumbnailFileId(fileID);
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  const handleFinalVideoUpload = async () => {
    const res = await loadScript(
      "https://upload-widget.cloudinary.com/global/all.js"
    );
    if (!res) {
      alert("you are offline");
      return;
    }

    let myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "codewithakky2",
        uploadPreset: "cqfs7ts8",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setMovie(result.info.secure_url);
          setVideo(true);
          console.log(result.info);
        }
      }
    );

    myWidget.open();
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // const formData = new FormData();

    // formData.append("videofiles", movie);
    // const body = {
    //   data: formData,
    // };
    // formData.append("upload_preset", "cqfs7ts8");
    // const fileID = await axios
    //   .post("/api/file/video", body, config)
    //   .then((res) => {
    //     alert("Video uploaded successfully");
    //     console.log(res.data);
    //     return res.data.fileId;
    //   })
    //   .catch((err) => console.log(err));

    // fetch("https://api.cloudinary.com/v1_1/codewithakky2/video/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => {
    //     console.log(res.json());
    //   })
    //   .then((data) => console.log(data));
    // if (fileID && fileID !== "") {
    //   setVideoFileId(fileID);
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (thumbnailFileId && movie) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        movieName: name,
        yearReleased: year,
        language: language,
        thumbnail: thumbnailFileId,
        movieUrl: movie,
      };

      axios
        .post("/api/movie", body, config)
        .then((res) => {
          alert("Movie added succefully");
          history.push("/");
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      alert("Upload assests first...");
    }
  };
  console.log(movie, thumbnail);
  console.log(thumbnailFileId);
  console.log(name, language, year);
  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="add-movie">
      <div className="add-container">
        <div className="add-data">
          <div className="add-info">
            <h3>Movie Name</h3>
            <input
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter movie name"
            />
          </div>

          <div className="add-info">
            <h3>Year of Release</h3>
            <input
              required={true}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              type="month"
              placeholder="Enter movie name"
            />
          </div>
          <div className="add-info">
            <h3>Language</h3>
            <select
              required={true}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {" "}
              <option>--select-language--</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Tamil தமிழ்">தமிழ்</option>
              <option value="Telugu తెలుగు">తెలుగు</option>
              <option value="Kannada ಕನ್ನಡ">ಕನ್ನಡ</option>
              <option value="Malyalam മലയാളം">മലയാളം</option>
              <option value="Bhojpuri भोजपुरी">भोजपुरी</option>
              <option value="Chinese 汉语">汉语</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="add-info">
            <div onClick={handleThumbnail} className="img-container">
              {!img ? (
                <>
                  <p>+</p>
                  <p>Upload Thumbnail</p>
                </>
              ) : (
                <>
                  {result && (
                    <>
                      <img
                        style={{
                          width: "100%",
                          objectFit: "contain",
                        }}
                        ref={imageRef}
                        src={result}
                        alt=""
                      />
                      <div
                        className="upload-media"
                        onClick={thumbnailFinalUpload}
                        style={{
                          position: "absolute",
                          height: "50px",
                          width: "50px",
                          bottom: "0",
                          right: "0",
                          opacity: "0.8",
                        }}
                      >
                        {" "}
                        {isUploading ? (
                          // percent === 100 ? (
                          //   <img
                          //     style={{
                          //       width: "50px",
                          //       height: "50px",
                          //       borderRadius: "50%",
                          //     }}
                          //     src={check}
                          //     alt=""
                          //   />
                          // ) : (
                          <>
                            {percent > 0 && (
                              <CircularProgressWithLabel value={percent} />
                            )}
                          </>
                        ) : (
                          // )
                          <CloudUpload />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              <input
                accept="image/png, image/gif, image/jpeg"
                onChange={handleThumbnailUpload}
                id="thumbnail"
                type="file"
                placeholder="Enter movie name"
              />
            </div>
          </div>
          <div className="add-info">
            <div onClick={handleFinalVideoUpload} className="vid-container">
              {video ? (
                <>
                  <video
                    className="video"
                    autoPlay={true}
                    loop
                    controls
                    src={movie}
                  ></video>
                </>
              ) : (
                <>
                  <p>+</p>
                  <p>Upload Video</p>
                </>
              )}

              {/* <input
                onChange={handleVideoUpload}
                id="movies"
                type="file"
                placeholder="Enter movie name"
              /> */}
            </div>
          </div>
        </div>
        <button onClick={handleSubmit}>SAVE</button>
      </div>
    </div>
  );
}

export default AddMovie;
