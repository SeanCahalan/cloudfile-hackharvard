import React, { Component } from "react";
import styles from "./FileOptions.scss";
import { connect } from "react-redux";
import fileDownload from "js-file-download";
import stream from "stream";
import axios from "axios";

class FileOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  deleteFile = () => {
    if (this.props.file.service === "dropbox") {
      axios
        .delete("/api/dropbox/delete", {
          data: { path: `/${this.props.file.name}` }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => console.log(err));
    } else {
      axios
        .delete("/api/google/delete", {
          data: { id: this.props.file.id }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => console.log(err));
    }
  };
  shareFile = () => {
    console.log(this.props.file);
  };
  sellFile = () => {
    console.log(this.props.file);
  };

  downloadFile = () => {
    if (this.props.file.service === "dropbox") {
      axios
        .post("/api/dropbox/download", {
          path: `/${this.props.file.name}`
        })
        .then(res => {
          // console.log(res.data);
          let bufferStream = new stream.PassThrough();
          bufferStream.end(res.data);
          fileDownload(bufferStream, this.props.file.name);
        })
        .catch(err => console.log(err));
    } else {
    }
  };
  render() {
    const fileDetails = () => {
      return (
        <div className="service">
          <div className="options">
            <span>{this.props.file.name}</span>
            <span>
              {this.props.file.size}
              MB
            </span>
          </div>
          <div className="options">
            <span onClick={this.deleteFile}>delete</span>
            <span onClick={this.shareFile}>share</span>
            <span onClick={this.sellFile}>sell</span>
            <span onClick={this.downloadFile}>download</span>
          </div>
        </div>
      );
    };

    return <div className={styles.FileOptions}>{fileDetails()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    info: state.user.info
  };
}

export default connect(mapStateToProps)(FileOptions);
