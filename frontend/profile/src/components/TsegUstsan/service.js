import {handleResponse, getPostOptions, getGetOptions} from '../service'
         

const prefix = '/profile/api/tseg-ustsan'

export const service = {
    tsegustsanEdit,
    searchTseg,
    tsegUstsan,
}

function tsegustsanEdit() {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/edit/`, opts).then(handleResponse)
}

function searchTseg(query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/search/`, opts).then(handleResponse)
}

function tsegUstsan(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }
    return fetch(`${prefix}/add/`, opts).then(handleResponse)
}