import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    tsegPersonal,
    tsegPersonalList,
    tsegPersonalRemove,
    updateTseg,
    searchTseg,
    tsegPersonalSuccess,
    findSum,
    searchTsegName,
    getFieldValue,
    successPoint,
    rejectPoint,
    getInspireList,
    getTseg,
    getEmpRole,
}

const prefix = '/gov/api/tseg-personal'

function getEmpRole() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/tseg-roles/` , requestOptions).then(handleResponse)
}

function tsegPersonalList(page, perpage, query){

    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query }),
    }

    return fetch(`${prefix}/list/`, requestOptions).then(handleResponse)
}

function tsegPersonalRemove(id, t_type) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, t_type}),
    }

    return fetch(`${prefix}/remove/`, opts).then(handleResponse)
}

function tsegPersonal(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }

    return fetch(`${prefix}/`, opts).then(handleResponse)
}

function updateTseg(id, geo_id){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, geo_id}),
    }
    return fetch(`${prefix}/update/`, opts).then(handleResponse)
}

function searchTseg(query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/search/`, opts).then(handleResponse)
}

function tsegPersonalSuccess(point_type, objectid, point_class, t_type){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({point_type, objectid, point_class, t_type}),
    }
    return fetch(`${prefix}/batalgaajuulah/`, opts).then(handleResponse)
}

function findSum(X, niitB) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({"x":niitB, "y":X})
    }
    return fetch(`${prefix}/findSum/`, requestOptions).then(handleResponse)
}

function searchTsegName(name, query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({name,query}),
    }
    return fetch(`${prefix}/searchName/`, opts).then(handleResponse)
}

function getFieldValue(){
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-field-values/`, opts).then(handleResponse)
}

function successPoint(id){
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/success-point/${id}/`, opts).then(handleResponse)
}

function rejectPoint(id){
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/remove-point/${id}/`, opts).then(handleResponse)
}

function getInspireList(page, perpage, query, sort_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query, sort_name }),
    }
    return fetch(`${prefix}/get-inspire-list/`, opts).then(handleResponse)
}

function getTseg(id, geo_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ id, geo_id }),
    }
    return fetch(`${prefix}/get-tseg/`, opts).then(handleResponse)
}