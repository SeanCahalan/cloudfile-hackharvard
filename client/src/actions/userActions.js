import axios from 'axios';

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
                    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                    window.FB.api('/me', function(response) {
                        console.log(response);

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

export function getUserInfo(){

}

