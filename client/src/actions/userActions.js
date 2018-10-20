import axios from 'axios';
import { Dropbox } from 'dropbox';

const appUrl = 'https://cloudfile.localtunnel.me/';

function setLoginData(fbid, name) {
    localStorage.setItem("fbid", fbid);
    localStorage.setItem("name", name);
    axios.defaults.headers.common["Authorization"] = "Bearer " + fbid;
}

function removeLoginData() {
    localStorage.removeItem("fbid");
    localStorage.removeItem("name");
    delete axios.defaults.headers.common["Authorization"];
}

export function fbUpdateStatus(status) {
    return function(dispatch) {
        dispatch({ type: "FB_LOADED", payload: status });
    };
}

// export function tokenLogin(token){
//     return function(dispatch){
//         axios.post('/auth/login', {fbid: token})
//             .then(res => {
//                 console.log(res.data);
                
//                 dispatch({type: "LOGIN_SUCCESS", payload:{ 
//                     name: response.name
//                 }})
//             }).catch(err => {
//                 console.log(err.data)
//             })
//     }
// }

export function logout(){
    removeLoginData();
    return function(dispatch) {
        window.FB.getLoginStatus(function(response) {
            if (response && response.status === "connected") {
                window.FB.logout(res => {
                    dispatch({ type: "LOGOUT_SUCCESS" });
                });
            } else {
                dispatch({ type: "LOGOUT_SUCCESS" });
            }
        });
    };
}

export function login(fbid){
    return function(dispatch){
        if(fbid){
            console.log("loggin in with stored fbid")
            axios.post('/auth/login', {fbid: fbid})
                .then(res => {
                    console.log(res.data);
                    dispatch({type: "LOGIN_SUCCESS", payload: res.data})
                }).catch(err => {
                    console.log(err.data)
                })
        } else {
            window.FB.login(
                response => {
                    if (response.authResponse) {
                        
                        // set axios headers to use Bearer auth
                        window.FB.api('/me', function(response) {
                            console.log(response);
                            let fbid = response.id;
                            let name = response.name;
                            setLoginData(fbid, name);
        
                            // TODO backend call
                            axios.post('/auth/login', {fbid: fbid})
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
