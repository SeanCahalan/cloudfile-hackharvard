export const initialState = {
    files: []
};

export function fileReducers(state = initialState, action) {
    switch (action.type) {
        
        case "GOT_DOWNLOAD":
            return {
                ...state,
                files: [...state.files, action.payload]
            };
        case 'FETCH_DROPBOX':
            return {
                ...state,
                files: [
                    ...state.files, 
                    ...action.payload
                ]
            }
        case 'FETCH_GOOGLE':
            return {
                ...state,
                files: [
                    ...state.files, 
                    ...action.payload
                ]
            }
        case "LOGOUT_SUCCESS":
            return {
                ...state,
                files: []
            };
        default:
            return state;
    }
}

export default { initialState, reducer: fileReducers };
