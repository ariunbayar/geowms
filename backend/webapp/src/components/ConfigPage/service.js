import {getGetOptions, getPostOptions, handleResponse} from '@/helpers/service'


export const service = {
    getAll,
    getDetail,
    update,
    create,
    remove
}


const prefix = '/back/api/config'


function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/all/`, requestOptions).then(handleResponse)
}


function getDetail(id) {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/${id}/detail/`, opts).then(handleResponse)
}


function update(id, values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }
    return fetch(`${prefix}/${id}/update/`, opts).then(handleResponse)
}


function create(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }
    return fetch(`${prefix}/create/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {...getPostOptions()}
    return fetch(`${prefix}/${id}/delete/`, opts).then(handleResponse)
}