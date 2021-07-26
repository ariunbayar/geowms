import { handleResponse, getGetOptions, getPostOptions } from "@helpUtils/handleRequest"

export const service = {
    getAll,
    update,
    swap,
    roleCreate,
    roleRemove,
    defaultCheckUpdate,
    detail,
    getLayer
}

const prefix = '/back'

function getAll() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/bundle/all/`, requestOptions).then(handleResponse)
}


function detail(id) {
    const requestOptions = {...getGetOptions()}

    return fetch(`${prefix}/bundle/${id}/update-detail/`, requestOptions).then(handleResponse)
}

function getLayer(id) {
    const requestOptions = {...getGetOptions()}

    return fetch(`${prefix}/bundle/get-layer/`, requestOptions).then(handleResponse)
}

function update(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/update/`, opts).then(handleResponse)
}


function swap(swap_one, swap_two) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({swap_one, swap_two}),
    }

    return fetch(`${prefix}/bundle/swap/`, opts).then(handleResponse)
}

function roleCreate(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/role-create/`, opts).then(handleResponse)
}

function roleRemove(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/role-remove/`, opts).then(handleResponse)
}

function defaultCheckUpdate(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/default-check-update/`, opts).then(handleResponse)
}
