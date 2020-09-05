import {handleResponse, getPostOptions, getGetOptions} from '../service'
         

const prefix = '/profile/api/tseg-ustsan'

export const service = {
    tsegustsanEdit,
    searchTseg,
    tsegUstsanAll,
}

function tsegustsanEdit(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
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

function tsegUstsanAll(id) {
    const opts = {
        ...getGetOptions(id),
    }
    return fetch(`${prefix}/list/`, opts).then(handleResponse)
}