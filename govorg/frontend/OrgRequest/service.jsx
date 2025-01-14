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

function requestReject(ids, feature_id, desc, action_type) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ ids, feature_id, desc, action_type }),
    }
    return fetch(`${prefix}/reject/`, requestOptions).then(handleResponse)
}

function requestApprove(ids, feature_id, ref_in_direct) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ids, feature_id, ref_in_direct}),
    }
    return fetch(`${prefix}/approve/`, requestOptions).then(handleResponse)
}
