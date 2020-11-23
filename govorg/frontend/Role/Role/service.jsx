
import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    getPerms,
    createRole,
    updateRole,
    deleteRole,
    detailRole,
}

const prefix = '/gov/api/role/org'

function getPerms() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function createRole(values){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values })
    }

    return fetch(`${prefix}/create/`, requestOptions).then(handleResponse)
}

function updateRole(id, values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values })
    }

    return fetch(`${prefix}/${id}/update/`, requestOptions).then(handleResponse)
}

function deleteRole(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/delete/`, requestOptions).then(handleResponse)
}

function detailRole(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/detail/`, requestOptions).then(handleResponse)
}