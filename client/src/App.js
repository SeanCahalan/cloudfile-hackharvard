import React, { Component } from 'react';
import { connect } from "react-redux";

import { fbUpdateStatus } from './actions/userActions';

import Login from './components/auth/Login/Login';
import Main from './components/pages/Main/Main';

class App extends Component {
    componentDidMount() {

        window.fbAsyncInit = () => {
            window.FB.init({
                appId: '325135954735646',
                autoLogAppEvents: true,
                xfbml: true,
                version: "v3.1"
            });
            this.props.fbUpdateStatus(true);
        };

        (function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
    }

    render() {
        return (
        <div className="App">
            { this.props.user.info ? 
                (
                    <Main />
                ) : (
                    <Login 
                        fbLoaded={this.props.user.fbLoaded}
                    />
                )
            }
        </div>
        );
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

const actions = { fbUpdateStatus }

export default connect(mapStateToProps, actions)(App);
