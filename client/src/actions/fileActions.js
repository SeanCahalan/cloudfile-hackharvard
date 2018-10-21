import axios from 'axios';

export function dropboxDownload(){
    return function(dispatch){
        axios.post('/api/dropbox/download', {path: '/custom/images/background-1462755_960_720.jpg'})
        .then(res => {
            console.log(res);
            dispatch({type: 'GOT_DOWNLOAD', payload: res})
        })
    }
}

export function dropboxFetch(){
    return function(dispatch){
        axios.post('/api/dropbox/fetch', {path: ''})
        .then(res => {
            console.log(res);
            dispatch({type: 'FETCH_DROPBOX', payload: res.data})
        })
    }
}

export function googleFetch(id){
    return function(dispatch){
        axios.post('/api/google/fetch', {parentId: id})
        .then(res => {
            console.log(res);
            dispatch({type: 'FETCH_GOOGLE', payload: res.data})
        }).catch(err => {
            console.log(err)
        })
    }
}

export function changeDirectoryGoogle(id, name, parentId){
    return function(dispatch){
        axios.post('/api/google/fetch', {parentId: id})
        .then(res => {
            console.log(res);
            dispatch({type: 'CHANGE_GOOGLE_DIRECTORY', payload: {data: res.data, id: id, name: name, parentId: parentId}})
        }).catch(err => {
            console.log(err)
        })
    }
}