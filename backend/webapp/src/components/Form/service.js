import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'

const prefix = '/back/tuuhen_ov'

export const service = {
    tsegPersonal,
    tsegUstsan,
    tsegPersonalList,
    tsegPersonalRemove,
    tsegUstsanAll,
    tseg_remove,
    tsegustsanEdit,
    updateTseg,
    searchTseg,
    tsegPersonalSuccess,
    findSum,
}

function tsegPersonalList(page, perpage, query){

    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query }),
    }

    return fetch(`${prefix}/tseg-personal/list/`, requestOptions).then(handleResponse)
}

function tsegPersonalRemove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/tseg-personal/remove/`, opts).then(handleResponse)
}

function tsegPersonal(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }

    return fetch(`${prefix}/tseg-personal/`, opts).then(handleResponse)
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

function tseg_remove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan-remove/`, opts).then(handleResponse)
}

function tsegustsanEdit(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan_edit/`, opts).then(handleResponse)
}

function updateTseg(id){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-personal/update/`, opts).then(handleResponse)
}

function searchTseg(query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/tseg-personal/search/`, opts).then(handleResponse)
}

function tsegPersonalSuccess(point_type, objectid, point_class, t_type){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({point_type, objectid, point_class, t_type}),
    }
    return fetch(`${prefix}/tseg-personal/batalgaajuulah/`, opts).then(handleResponse)
}

function findSum(X, niitB) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({"x":niitB, "y":X})
    }
    return fetch(`/back/tuuhen_ov/tseg-personal/findSum/`, requestOptions).then(handleResponse)
}