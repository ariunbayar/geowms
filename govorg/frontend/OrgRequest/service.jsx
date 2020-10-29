import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'
export const service = {
    getAll,
    requestDelete,
    requestApprove
}

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/org-request/`, requestOptions).then(handleResponse)
}

function requestDelete(id) {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/org-request/${id}/delete/`, requestOptions).then(handleResponse)
}

function requestApprove(id, values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values}),
    }
    return fetch(`/gov/api/org-request/${id}/approve/`, requestOptions).then(handleResponse)
}
