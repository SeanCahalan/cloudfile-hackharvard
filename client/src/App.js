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
