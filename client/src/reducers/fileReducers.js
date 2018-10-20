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
                files: [...state.files, ...action.payload]
            }
        default:
            return state;
    }
}

export default { initialState, reducer: fileReducers };
