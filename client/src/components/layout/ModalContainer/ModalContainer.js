import React, { Component } from "react";
import styles from "./ModalContainer.scss";

import classnames from "classnames";

export default class ModalContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        };
    }

    toggle = () => {
        this.setState({ open: !this.state.open });
    };

    render() {
        const modalClass = classnames("modal-container", {
            open: this.state.open
        });

        return (
            <div className={styles.ModalContainer}>
                <div className={modalClass} onClick={this.toggle}>
                    <div
                        className="modal"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="close" onClick={this.toggle}>
                            <i className="fa fa-times" />
                        </div>
                        <div className="content">{this.props.content}</div>
                    </div>
                </div>

                <div className="click-wrapper" onClick={this.toggle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
