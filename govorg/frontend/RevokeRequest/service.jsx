import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    getAll,
    revokeState,
}

const prefix = '/gov/api/revoke_request'

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function revokeState(id, state) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ id, state })
    }
    return fetch(`${prefix}/revoke-change-state/`, requestOptions).then(handleResponse)
}