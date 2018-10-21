import React, { Component } from "react";
import styles from "./AddPaymentMethod.scss";
import classnames from "classnames";
import { connect } from "react-redux";

// TODO add import
//import { addPaymentMethod } from "../../../actions/";

class AddPaymentMethod extends Component {
    constructor(props) {
        super();
        this.state = {
            name: "",
            elements: null,
            cardNumber: null,
            cardExpiry: null,
            cardCvc: null
        };
    }

    componentDidMount() {
        //this.setState({elements: window["stripe"].elements()})
        var style = {
            base: {
                // Add your base input styles here. For example:
                fontSize: "16px",
                textAlign: "center"
            }
        };

        var elements = window.stripe.elements();
        this.setState({
            cardNumber: elements.create("cardNumber", { style: style })
        });
        this.setState({
            cardExpiry: elements.create("cardExpiry", { style: style })
        });
        this.setState({
            cardCvc: elements.create("cardCvc", { style: style })
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.cardNumber && this.state.cardNumber) {
            this.state.cardNumber.mount("#card-number");
            this.state.cardExpiry.mount("#card-expiry");
            this.state.cardCvc.mount("#card-cvc");
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    sendToken = () => {
        window["stripe"]
            .createToken(this.state.cardNumber, {
                name: this.state.name
            })
            .then(res => {
                // TODO fire action
                // this.props.addPaymentMethod(res);
            });
    };

    render() {
        return (
            <div className={classnames(styles.AddPaymentMethod, "component")}>
                <img src="/img/icons/Icon_Payment.svg" alt="" />
                <h2>Add Payment Method</h2>
                <p>CARD NUMBER</p>
                <div id="card-number" className="input-wrapper" />
                <p>CARDHOLDER NAME</p>
                <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <div className="row">
                    <div className="col">
                        <p>EXPIRY DATE</p>
                        <div id="card-expiry" className="input-wrapper" />
                    </div>
                    <div className="col">
                        <p>CVC</p>
                        <div id="card-cvc" className="input-wrapper" />
                    </div>
                </div>

                <div onClick={this.sendToken} className="btn primary">
                    Add this card
                </div>
            </div>
        );
    }
}

const actions = {
    //TODO uncomment
    //addPaymentMethod 
};

export default connect(
    null,
    actions
)(AddPaymentMethod);
