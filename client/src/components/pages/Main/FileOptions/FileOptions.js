import React, { Component } from "react";
import styles from "./FileOptions.scss";
import { connect } from "react-redux";
import axios from "axios";

class FileOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  deleteFile = () => {
    console.log(this.props.file.fileId);
  };
  shareFile = () => {
    console.log(this.props.file.fileId);
  };
  sellFile = () => {
    console.log(this.props.file.fileId);
  };
  downloadFile = () => {
    console.log(this.props.file.fileId);
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
