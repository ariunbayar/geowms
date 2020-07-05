import {getGetOptions, getPostOptions, handleResponse} from '@/helpers/service'

export const service = {
    getAll,
    create,
    update,
    remove,
    detail,
}


const prefix = '/back/api/байгууллага'


function getAll() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}


function create(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/үүсгэх/`, opts).then(handleResponse)
}


function update(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/update/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/remove/`, opts).then(handleResponse)
}


function detail(id) {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/дэлгэрэнгүй/`, opts).then(handleResponse)
}
