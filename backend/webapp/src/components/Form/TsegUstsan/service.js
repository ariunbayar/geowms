import {handleResponse, getPostOptions, getGetOptions} from '../../../helpers/service'

const prefix = '/back/tuuhen_ov'

export const service = {
    tsegustsanEdit,
    searchTseg,
    tsegUstsan,
    tseg_success,
    tsegUstsanAll,
    tseg_remove,
}

function tsegustsanEdit(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan_edit/`, opts).then(handleResponse)
}

function searchTseg(query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/tseg-personal/search/`, opts).then(handleResponse)
}

function tsegUstsan(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }
    return fetch(`${prefix}/tseg-ustsan/`, opts).then(handleResponse)
}

function tsegUstsanAll(id) {
    const opts = {
        ...getGetOptions(id),
    }
    return fetch(`${prefix}/tseg-ustsan_all/`, opts).then(handleResponse)
}

function tseg_success(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan-success/`, opts).then(handleResponse)
}

function tseg_remove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan-remove/`, opts).then(handleResponse)
}