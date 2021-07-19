import {getGetOptions, handleResponse, getPostOptions} from '../../helpers/service'

export const service ={
    createPerm,
    getInspireRoles,
    saveInspireRoles,
    remove,
    getDetailRole,
}

const prefix = '/back/api/org'

function createPerm(values, pk) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values, pk }),
    }
    return fetch(`${prefix}/create-perm/`, requestOptions).then(handleResponse)
}


function getInspireRoles(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/inspire-roles/${id}/`, requestOptions).then(handleResponse)
}

function saveInspireRoles(id, values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values}),
    }
    return fetch(`${prefix}/inspire-roles/${id}/save/`, requestOptions).then(handleResponse)
}

function remove(id) {
    const requestOptions = {
        ...getPostOptions(),
    }

    return fetch(`${prefix}/org-role/${id}/remove-role/`, requestOptions).then(handleResponse)
}

function getDetailRole(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/org-role/${id}/role-detail/`, requestOptions).then(handleResponse)
}
