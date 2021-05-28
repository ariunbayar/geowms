import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    requestReject,
    requestApprove,
    requestReturn,
}

const prefix = '/gov/api/llc-request'

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

function requestReturn(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ids, feature_id}),
    }
    return fetch(`${prefix}/return/`, requestOptions).then(handleResponse)
}
