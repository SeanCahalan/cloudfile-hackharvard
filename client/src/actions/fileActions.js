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