var _ = require('lodash');

export const initialState = {
    files: [],
    directoryFiles: [],
    directory: {
        current: "Filetron",
        "Filetron": {name: "Filetron"}
    }
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
                ],
                directoryFiles: [
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
                ],
                directoryFiles: [
                    ...state.files, 
                    ...action.payload
                ]
            }
        case 'CHANGE_GOOGLE_DIRECTORY':
            let updatedDirectory = _.clone(state.directory, true)
            updatedDirectory.current = action.payload.id;
            updatedDirectory[action.payload.id] = {parent: action.payload.parentId || 'Filetron', name: action.payload.name};
            console.log(updatedDirectory)
            return {
                ...state,
                directoryFiles: action.payload.data,
                directory: updatedDirectory
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
