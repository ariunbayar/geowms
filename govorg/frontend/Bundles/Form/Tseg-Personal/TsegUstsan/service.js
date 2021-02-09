import {handleResponse, getPostOptions, getGetOptions} from '../../../../components/helpers/service'

export const service = {
    tsegustsanEdit,
    searchTseg,
    tsegUstsan,
    tseg_success,
    tseg_remove,
    paginatedList
}

const prefix = '/gov/api/tuuhen_ov'
const tseg_personal_prefix = '/gov/api/tseg-personal'
const tseg_ustsan_prefix = '/gov/api/tseg-ustsan'


function tsegustsanEdit(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${tseg_ustsan_prefix}/edit/`, opts).then(handleResponse)
}

function searchTseg(query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${tseg_personal_prefix}/search/`, opts).then(handleResponse)
}

function tsegUstsan(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }
    return fetch(`${tseg_ustsan_prefix}/`, opts).then(handleResponse)
}

function tseg_success(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${tseg_ustsan_prefix}/success/`, opts).then(handleResponse)
}

function tseg_remove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${tseg_ustsan_prefix}/remove/`, opts).then(handleResponse)
}

function paginatedList(page,perpage,query) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({page,perpage,query}),
    }
    return fetch(`${tseg_ustsan_prefix}/list/`, opts).then(handleResponse)
}