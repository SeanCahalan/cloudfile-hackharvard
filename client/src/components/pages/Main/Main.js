import React, { Component } from "react";
import styles from "./Main.scss";
import { connect } from "react-redux";
import axios from "axios";
import { addDropbox, logout } from "../../../actions/userActions";
import { fileIcon } from "../../../util/data";

import AddService from "./AddService/AddService";
import FileOptions from "./FileOptions/FileOptions";
import ModalContainer from "../../layout/ModalContainer/ModalContainer";
import AddPaymentMethod from "../../stripe/AddPaymentMethod/AddPaymentMethod";
import AddPayoutMethod from "../../stripe/AddPayoutMethod/AddPayoutMethod";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: ""
    };
  }

  handleUploadImage = ev => {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    axios.post("/api/dropbox/upload", data).then(response => {
      console.log(response);
    });
  };

  render() {
    let foldersOwned = [];
    let filesOwned = [];
    let foldersShared = [];
    let filesShared = [];
    console.log(this.props.files);
    this.props.files.forEach(item => {
      let div = (
        <div
          key={item.name + item.lastModified}
          className={"file col " + item.service}
        >
          <div className={"preview " + item.service}>
            <i className={`fas fa-file-${fileIcon[item.name.split(".")[1]]}`} />
          </div>
          <div className="info">
            <div>{item.name}</div>
            <ModalContainer content={<FileOptions file={item} />}>
              <i className="fas fa-ellipsis-v dots" />
            </ModalContainer>
          </div>
        </div>
      );
      if (item.isFolder) {
        if (item.shared) {
          foldersShared.push(div);
        } else {
          foldersOwned.push(div);
        }
      } else {
        if (item.shared) {
          filesShared.push(div);
        } else {
          filesOwned.push(div);
        }
      }
    });

    return (
      <div className={styles.Main}>
        <div className="sidebar col">
          <div className="logo">CLOUD FILE</div>

          <div className="name">
            {this.props.info.name || localStorage.getItem("name")}
          </div>
          <ModalContainer content={<AddService />}>
            <div className="action add-service">
              Add Service
              <i className="fas fa-plus" />
            </div>
          </ModalContainer>

          <ModalContainer content={<AddPaymentMethod />}>
            <div className="action add-payment">
              {this.props.info.cards
                ? "Payment Method Added"
                : "Add Payment Method"}
              {this.props.info.cards ? (
                <i className="fas fa-check" />
              ) : (
                <i className="fas fa-plus" />
              )}
            </div>
          </ModalContainer>

          <ModalContainer content={<AddPayoutMethod />}>
            <div className="action add-payout">
              {this.props.info.cards
                ? "Payout Method Added"
                : "Add Payout Method"}
              {this.props.info.cards ? (
                <i className="fas fa-check" />
              ) : (
                <i className="fas fa-plus" />
              )}
            </div>
          </ModalContainer>
          <form onSubmit={this.handleUploadImage}>
            <div>
              <input
                ref={ref => {
                  this.uploadInput = ref;
                }}
                type="file"
              />
            </div>
            <div>
              <button>Upload</button>
            </div>
          </form>

          <div className="list-item logout" onClick={this.props.logout}>
            Logout
          </div>
        </div>

        <div className="body col">
          <div className="scroll-wrapper col">
            <div className="header">My folders</div>
            <div className="file-wrapper">{foldersOwned}</div>

            <div className="header">Folders shared with me</div>
            <div className="file-wrapper">{foldersShared}</div>

            <div className="header">My files</div>
            <div className="file-wrapper">{filesOwned}</div>

            <div className="header">Files shared with me</div>
            <div className="file-wrapper">{filesShared}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    info: state.user.info,
    files: state.files.files
  };
}

const actions = { addDropbox, logout };

export default connect(
  mapStateToProps,
  actions
)(Main);
