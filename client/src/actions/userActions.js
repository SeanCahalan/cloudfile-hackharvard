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
                        dispatch({type: "LOGIN_SUCCESS", payload:{ 
                            name: response.name
                        }})
                      });
                    // TODO backend call
                    

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

