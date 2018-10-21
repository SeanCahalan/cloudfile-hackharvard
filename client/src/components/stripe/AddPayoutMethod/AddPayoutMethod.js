import React, { Component } from "react";
import styles from "./AddPayoutMethod.scss";
import classnames from "classnames";
import { connect } from "react-redux";

// TODO import the action
// import { addPayoutMethod } from "../../../actions/";

class AddPayoutMethod extends Component {
    constructor(props) {
        super();
        this.state = {
            country: "CA",
            currency: "cad",
            routing_number: "",
            account_number: "",
            account_holder_name: "",
            account_holder_type: "individual"
        };
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    sendToken = () => {
        window["stripe"]
            .createToken("bank_account", {
                country: this.state.country,
                currency: this.state.currency,
                routing_number: this.state.routing_number,
                account_number: this.state.account_number,
                account_holder_name: this.state.account_holder_name,
                account_holder_type: "individual"
            })
            .then(res => {
                // TODO fire action after getting strip token
                // this.props.addPayoutMethod(res);
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className={classnames(styles.AddPayoutMethod, "component")}>
                <img src="/img/icons/Icon_Payout.svg" alt="" />
                <h2>Add Payout Method</h2>

                <p>ROUTING NUMBER</p>
                <input
                    type="text"
                    name="routing_number"
                    value={this.state.routing_number}
                    onChange={this.handleChange}
                />
                <p>ACCOUNT NUMBER</p>
                <input
                    type="text"
                    name="account_number"
                    value={this.state.account_number}
                    onChange={this.handleChange}
                />
                <p>ACCOUNT HOLDER NAME</p>
                <input
                    type="text"
                    name="account_holder_name"
                    value={this.state.account_holder_name}
                    onChange={this.handleChange}
                />

                <div onClick={this.sendToken} className="btn primary">
                    Add this bank
                </div>
            </div>
        );
    }
}

const actions = { 
    // TODO uncomment
    // addPayoutMethod 
};

export default connect(
    null,
    actions
)(AddPayoutMethod);
