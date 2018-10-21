export const initialState = {
    owned: [],
    shared: [],
    unsorted: []
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
                owned: [
                    ...state.owned, 
                    ...action.payload.owned
                ],
                shared: [
                    ...state.shared,
                    ...action.payload.shared
                ]
            }
        case 'FETCH_GOOGLE':
            return {
                ...state,
                unsorted: action.payload
            }
        case "LOGOUT_SUCCESS":
            return {
                ...state,
                files: {}
            };
        default:
            return state;
    }
}

export default { initialState, reducer: fileReducers };
