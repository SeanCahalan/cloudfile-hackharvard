export const initialState = {
    info: false,
    auth: {
        state: null,
        error: ""
    },
    fbLoaded: false,
};

export function userReducers(state = initialState, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                auth: {
                    state: "success",
                    error: null
                },
                info: action.payload
            };
        case "LOGIN_ERROR":
            return {
                ...state,
                auth: {
                    error: action.payload,
                    state: "error"
                }
            };
            //
        case "ADD_SERVICE":
            return {
                ...state,

            }
        case "GOT_ME":
            return {
                ...state,
                info: action.payload
            }
        case "LOGOUT_SUCCESS":
            return {
                ...state,
                info: false
            };
        case "FB_LOADED":
            return {
                ...state,
                fbLoaded: true
            };
        default:
            return state;
    }
}

export default { initialState, reducer: userReducers };
