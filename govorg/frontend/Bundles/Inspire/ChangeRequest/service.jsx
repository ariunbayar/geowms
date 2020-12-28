import {handleResponse, getGetOptions, getPostOptions} from '../../../components/helpers/service'
export const service = {
    getAll,
    detail,
    controlToApprove,
    controlToRemove
}
const prefix = '/gov/api/inspire'

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/org-request/change-request/`, requestOptions).then(handleResponse)
}

function detail(gid, tid, fid) {
    const opts = getGetOptions()
    return fetch(`${prefix}/${gid}/${tid}/${fid}/detailUpdate/`, opts).then(handleResponse)
}

function controlToApprove(values, change_request_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({values, change_request_id}),
    }
    return fetch(`/gov/api/inspire/control-to-approve/`, opts).then(handleResponse)
}

function controlToRemove(change_request_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({change_request_id}),
    }
    return fetch(`/gov/api/inspire/control-to-remove/`, opts).then(handleResponse)
}
