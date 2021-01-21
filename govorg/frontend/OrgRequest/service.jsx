import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    getAll,
    requestDelete,
    requestApprove,
    requestSearch,
}

const prefix = '/gov/api/org-request'

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function requestDelete(id) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/${id}/delete/`, requestOptions).then(handleResponse)
}

function requestApprove(id, values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values}),
    }
    return fetch(`${prefix}/${id}/approve/`, requestOptions).then(handleResponse)
}

function requestSearch(state, kind, theme_id, package_id, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({state, kind, theme_id, package_id, feature_id}),
    }
    return fetch(`${prefix}/search/`, requestOptions).then(handleResponse)
}
