import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    requestReject,
    requestApprove,
    getChoices,
}

const prefix = '/gov/api/org-request'

function getChoices() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/get_choices/`, requestOptions).then(handleResponse)
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
