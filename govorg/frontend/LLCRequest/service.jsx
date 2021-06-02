import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    requestReject,
    requestApprove,
    requestDismiss,
    llcList,
    handleRequestData,
    getFilesDetal,
    getInspireTree
}

const prefix = '/gov/api/llc-request'

function getFilesDetal(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`/llc/backend/${id}/get-file-shapes/`, opts).then(handleResponse)
}

function requestReject(id, state) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ id, state }),
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

function requestDismiss(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ids, feature_id}),
    }
    return fetch(`${prefix}/dismiss/`, requestOptions).then(handleResponse)
}

function llcList(id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ id }),
    }
    return fetch(`${prefix}`, requestOptions).then(handleResponse)
}

function handleRequestData(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/get-request-data/`, opts).then(handleResponse)
}

function getInspireTree() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`/back/another-database/pg/get-all-view-names/`, opts).then(handleResponse)
}

