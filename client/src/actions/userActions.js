import axios from 'axios';
import { Dropbox } from 'dropbox';

const appUrl = process.env.NODE_ENV === 'development' ?
'http://localhost:3000' : process.env.APP_URL;

function setLoginData(fbid, name) {
    localStorage.setItem("fbid", fbid);
    localStorage.setItem("name", name);
    axios.defaults.headers.common["Authorization"] = "Bearer " + fbid;
}

function removeLoginData() {
    localStorage.removeItem("fbid");
    localStorage.removeItem("name");
    // localStorage.removeItem("fbAccessToken")
    delete axios.defaults.headers.common["Authorization"];
}

export function fbUpdateStatus(status) {
    return function(dispatch) {
        dispatch({ type: "FB_LOADED", payload: status });
    };
}

export function getMe(){
    return function(dispatch) {
        axios.get('/api/services/me')
        .then(res => {
            dispatch({ type: "GOT_ME", payload: res.data });
        })
        
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

export function login(accessToken){
    return function(dispatch){

        // if(accessToken){
        //     axios.post('/auth/login', null, {headers: {'Authorization': 'Bearer ' + accessToken}})
        //         .then(res => {
        //             console.log(res.data);
        //             //localStorage.setItem('fbAccessToken', res.data.facebook.accessToken)
        //             dispatch({type: "LOGIN_SUCCESS", payload: res.data })
        //         }).catch(err => {
        //             console.log(err.data)
        //         })
        // } else {
            window.FB.login(
                response => {
                    console.log(response)
                    if (response.authResponse) {
                        let access_token = response.authResponse.accessToken;
                        console.log(access_token);
                        // set axios headers to use Bearer auth
                        window.FB.api('/me', function(response) {
                            console.log(response);
                            let fbid = response.id;
                            let name = response.name;
                            // TODO backend call
                            setLoginData(fbid, name);
                            axios.post('/auth/login', null, {headers: {'Authorization': 'Bearer ' + access_token}})
                            .then(res => {
                                //localStorage.setItem('fbAccessToken', res.data.facebook.accessToken)
                                dispatch({type: "LOGIN_SUCCESS", payload: res.data})
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
                { scope: "email,user_birthday,user_friends" }
            );
        }  
    // }      
}

/**
 * Simulate a click event.
 * @public
 * @param {Element} elem  the element to simulate a click on
 */
var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};

export function addDropbox(){
    return function(dispatch){
        const CLIENT_ID='degcrih2vk286xu';
        var dbx = new Dropbox({ clientId: CLIENT_ID });
        localStorage.setItem('serviceToAdd', 'dropbox')
        const authUrl = dbx.getAuthenticationUrl(appUrl);
        console.log(authUrl);
        var elem = document.createElement('a');
        elem.setAttribute('id', 'authlink');
        elem.classList.add('displayNone');
        document.querySelector(".body").appendChild(elem)
        elem.href = authUrl;
        simulateClick(elem);
        dispatch({type: "GET_ACCESS_TOKEN", payload: {service: 'dropbox'}});
    }
}


  

export function addGoogle(){
    return function(dispatch){
        axios.post('/api/services/googleAuth', {url: appUrl})
        .then(res => {
            console.log(res)
            let authUrl = res.data;
            localStorage.setItem('serviceToAdd', 'google')

            var elem = document.createElement('a');
            elem.setAttribute('id', 'authlink');
            elem.classList.add('displayNone');
            document.querySelector(".body").appendChild(elem)
            elem.href = authUrl;
            simulateClick(elem);

            dispatch({type: "GET_ACCESS_TOKEN", payload: {service: 'google'}});


        }).catch(err => {
            console.log(err);
        })

        
    }
}

export function getGoogleToken(code){
    return function(dispatch){
        axios.post('/api/services/googleToken', {code: code, url: appUrl})
        .then(res => {
            console.log(res)
            let data = res.data;
            let body = {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                scope: data.scope,
                token_type: data.token_type,
                expiry_date: data.expiry_data,
                service: 'google'
            }
            axios.post('/api/services', body)
            .then(res => {
                removeHash();
                console.log(res);
                localStorage.removeItem('serviceToAdd');
                dispatch({type: "ADD_SERVICE", payload: 'google'});
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
}

function removeHash () { 
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in window.history)
        window.history.pushState("", document.title, loc.pathname + loc.search);
    else {
        console.log('RESET LINK')
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.search = ""
        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

function removeSearch () { 
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in window.history)
        window.history.pushState("", document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.search = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

// for dropbox, body: { token: dropbox_token, service: 'dropbox' }
  /* google drive:
    body: {
      access_token: {google_access_token},
      refresh_token: {google_refresh_token},
      scope: {google_scope},
      token_type: {google_token_type},
      expiry_date: {google_expiry_date},
      service: 'google'
    }
  */

export function addService(params, service){
    return function(dispatch){
        let body = {
            ...params,
            service: service
        }
        axios.post('/api/services', body)
        .then(res => {
            removeHash();
            console.log(res);
            localStorage.removeItem('serviceToAdd');
            dispatch({type: "ADD_SERVICE", payload: service});
        }).catch(err => {
            console.log(err)
        })
    }
}
