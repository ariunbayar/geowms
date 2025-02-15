import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    requestReject,
    requestApprove,
    requestDismiss,
    llcList,
    handleRequestData,
    getFilesDetal,
    getInspireTree,
    getChoices,
    Save,
    getLLCDetail,
    geomType
}

const prefix = '/gov/api/llc-request'

function getFilesDetal(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/get-file-shapes/`, opts).then(handleResponse)
}

function requestReject(id, description) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ id, description }),
    }
    return fetch(`${prefix}/reject/`, requestOptions).then(handleResponse)
}

function requestApprove(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/approve/${id}/`, requestOptions).then(handleResponse)
}

function requestDismiss(id, description) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({id, description}),
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

function getLLCDetail(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/get-request-detail/`, opts).then(handleResponse)
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

function getChoices() {
    const requestOptions = { ...getGetOptions() }
    return fetch(`${prefix}/get-search-choices/`, requestOptions).then(handleResponse)
}

function Save(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/inspire-save/`, opts).then(handleResponse)
}

function geomType(select) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ select }),
    }
    return fetch(`${prefix}/geom-type/`, opts).then(handleResponse)
}
