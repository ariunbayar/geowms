import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    getAll,
    requestReject,
    requestApprove,
    requestSearch,
}

const prefix = '/gov/api/org-request'

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function requestReject(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ ids, feature_id }),
    }
    return fetch(`${prefix}/reject/`, requestOptions).then(handleResponse)
}

function requestApprove(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ids, feature_id}),
    }
    return fetch(`${prefix}/approve/`, requestOptions).then(handleResponse)
}

function requestSearch(state, kind, theme_id, package_id, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({state, kind, theme_id, package_id, feature_id}),
    }
    return fetch(`${prefix}/search/`, requestOptions).then(handleResponse)
}
