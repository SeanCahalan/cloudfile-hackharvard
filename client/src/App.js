import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { fbUpdateStatus, login, addService, getGoogleToken } from './actions/userActions';
import { dropboxDownload, dropboxFetch, googleFetch } from './actions/fileActions';

import Login from './components/auth/Login/Login';
import Main from './components/pages/Main/Main';

class App extends Component {
    componentDidMount() {
        console.log(process.env)
        const fbid = localStorage.getItem('fbid')
        if(fbid)
            axios.defaults.headers.common["Authorization"] = "Bearer " + fbid;

        // get additional login data
        const fbAccessToken = localStorage.getItem('fbAccessToken')
        console.log(fbid, fbAccessToken)
        if(fbAccessToken)
            this.props.login(fbAccessToken)

        //parse redirect uri.
        const location = this.props.location;
        console.log(location)
        if(location.hash && fbid){
            let hashMap = {}
            location.hash.replace('#','').split('&').forEach(item => {
                let key_value = item.split('=');
                hashMap[key_value[0]] = key_value[1];
            });
            let access_token = hashMap.access_token;
            let service = localStorage.getItem('serviceToAdd');
            console.log("ADD SERVICE:", service, access_token)

            this.props.addService({token: access_token}, service);
        } else if(location.search){
            console.log('query:', location.search);
            let hashMap = {}
            location.search.replace('?','').split('&').forEach(item => {
                let key_value = item.split('=');
                hashMap[key_value[0]] = key_value[1];
            });
            let code = hashMap.code;
            this.props.getGoogleToken(code);

        }

        window.fbAsyncInit = () => {
            window.FB.init({
                appId: process.env.FACEBOOK_APP_ID,
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
            if(this.props.user.info.google){
                console.log('get the google')
                this.props.googleFetch('root');
            }
        }


        // this is the more proper way with fb login

        // if(!prevProps.user.fbLoaded && this.props.user.fbLoaded){      
        //     window.FB.getLoginStatus((response) => {
        //         console.log(response)
        //         if (response && response.status === "connected") {
        //            this.props.login(response.authResponse.accessToken)
        //         }
        //     });
        // }
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
        user: state.user,

    }
}

const actions = { 
    fbUpdateStatus,
    dropboxDownload,
    login,
    addService,
    dropboxFetch,
    googleFetch,
    getGoogleToken
}

export default withRouter(connect(mapStateToProps, actions)(App));
