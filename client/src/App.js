import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { fbUpdateStatus, login, addService } from './actions/userActions';
import { dropboxDownload, dropboxFetch } from './actions/fileActions';

import Login from './components/auth/Login/Login';
import Main from './components/pages/Main/Main';

class App extends Component {
    componentDidMount() {
        //parse redirect uri.

        const fbid = localStorage.getItem("fbid");
        if (fbid) {
            console.log("have fbid:", fbid)
            axios.defaults.headers.common["Authorization"] = "Bearer " + fbid;
            this.props.login(fbid);
        }

        const location = this.props.location;
        if(location.hash){
            let hashMap = {}
            location.hash.replace('#','').split('&').forEach(item => {
                let key_value = item.split('=');
                hashMap[key_value[0]] = key_value[1];
            });
            let access_token = hashMap.access_token;
            let service = localStorage.getItem('serviceToAdd');
            console.log("ADD SERVICE:", service, access_token)

            this.props.addService({token: access_token}, service);
        }

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

    componentDidUpdate(prevProps){
        if(!prevProps.user.info && this.props.user.info){
            this.props.dropboxFetch();
        }
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

const actions = { 
    fbUpdateStatus,
    dropboxDownload,
    login,
    addService,
    dropboxFetch
}

export default withRouter(connect(mapStateToProps, actions)(App));
