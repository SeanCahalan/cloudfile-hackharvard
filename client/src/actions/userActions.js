import axios from 'axios';
import { Dropbox } from 'dropbox';

const appUrl = 'https://cloudfile.localtunnel.me/';

export function fbUpdateStatus(status) {
    return function(dispatch) {
        dispatch({ type: "FB_LOADED", payload: status });
    };
}

export function login(){
    return function(dispatch){
        window.FB.login(
            response => {
                if (response.authResponse) {
                    let token = response.authResponse.accessToken;
                    // set axios headers to use Bearer auth
                    window.FB.api('/me', function(response) {
                        console.log(response);

                        localStorage.setItem("token", token);
                            axios.defaults.headers.common["Authorization"] = "Bearer " + token;

                        // TODO backend call
                        axios.post('/auth/login', {fbid: token})
                        .then(res => {
                            console.log(res.data);
                            
                            dispatch({type: "LOGIN_SUCCESS", payload:{ 
                                name: response.name
                            }})
                        }).catch(err => {
                            console.log(err.data)
                        })
                        
                      });
                } else {
                    console.log(
                        "User cancelled login or did not fully authorize."
                    );
                }
            },
            { scope: "email" }
        );
    }
}


export function addDropbox(){
    return function(dispatch){
        const CLIENT_ID='degcrih2vk286xu';
        var dbx = new Dropbox({ clientId: CLIENT_ID });

        const authUrl = dbx.getAuthenticationUrl(appUrl);
        console.log(authUrl);
        var elem = document.createElement('a');
        elem.setAttribute('id', 'authlink');
        document.querySelector(".body").appendChild(elem)
            elem.innerHTML = authUrl
        document.getElementById('authlink').href = authUrl;
        dispatch({type: "ADD_DROPBOX"});
    }
}
