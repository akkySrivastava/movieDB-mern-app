import React from "react";
import MovieIcon from "@material-ui/icons/Movie";
import "./css/Header.css";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();
  return (
    <div className="header">
      <div className="header-container">
        <div className="header-left">
          <div onClick={() => history.push("/")} className="header-title">
            <MovieIcon />
            <h3>Movie DB</h3>
          </div>
        </div>
        <div onClick={() => history.push("/upload")} className="header-right">
          <CloudUploadIcon />
          <button>Upload</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
