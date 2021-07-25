import React, { useEffect, useRef, useState } from "react";
import "./css/MovieDB.css";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { IconButton } from "@material-ui/core";
// import ReactTimeAgo from "react-time-ago";
// import TimeAgo from "javascript-time-ago";
// import en from "javascript-time-ago/locale/en";
// TimeAgo.addDefaultLocale(en);

function MovieDB() {
  const videoRef = useRef(null);
  // const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // const [show, setShow] = useState(false);
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios.get("/api/movie").then((res) => {
      setMovies(res.data);
      console.log(res.data);
    });
  }, []);
  // const handleVideoPlay = (movie) => {
  //   let video = document.createElement("video");
  //   let source = document.createElement("source");
  //   source.src = movie.movieUrl;
  //   video.appendChild(source);
  //   if (isVideoPlaying) {
  //     setIsVideoPlaying(false);
  //     videoRef.current.pause();
  //   } else {
  //     // video.src = movie.movieUrl;
  //     // document.getElementById("video-data").append(video);
  //     videoRef.current.play();
  //     setIsVideoPlaying((play) => !play);
  //   }
  // };
  // const agoDate = (date) => {
  //   var d = String(date).split(/\D/);
  //   var fdate = new Date(d[0], --d[1], d[2]);
  //   console.log(fdate);
  //   return fdate;
  // };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="movie">
      <div className="movie-container">
        <h1>Your Collections</h1>
        <div className="movie-contents">
          {movies.map((movie) => (
            <div
              style={{
                position: "relative",
              }}
              id="movie-data"
              // onClick={() => handleVideoPlay(movie)}
              key={movie._id}
              className="movie-content"
            >
              <ReactPlayer
                ref={videoRef}
                url={movie.movieUrl}
                playing={true}
                controls={true}
                light={movie.thumbnailUrl.filePath}
                volume={0.5}
                muted={false}
                // width={"600px"}
                // height={"400px"}
                // style={{
                //   display: "flex",
                //   width: "100%",
                //   maxWidth: "auto",
                // }}
                playIcon={
                  <IconButton className="play-button">
                    <PlayCircleFilledIcon />
                  </IconButton>
                }
              />
              {/* <img src={movie.thumbnailUrl.filePath} alt="" /> */}
              <h3>{movie.name}</h3>
              <p>
                <span>{movie.language}</span> |
                <span>
                  {" "}
                  {movie.yearReleased}
                  <br />
                  <span
                    style={{
                      color: "#666",
                      fontSize: "small",
                    }}
                  >
                    <i>Uploaded on </i>
                    {new Date(movie.uploaded).getDate() +
                      " " +
                      months[new Date(movie.uploaded).getMonth()] +
                      " " +
                      new Date(movie.uploaded).getFullYear()}{" "}
                    at {new Date(movie.uploaded).getHours()} :{" "}
                    {new Date(movie.uploaded).getMinutes()} hrs
                  </span>
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDB;