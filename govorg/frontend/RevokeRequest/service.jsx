import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    getAll,
}

const prefix = '/gov/api/revoke_request'

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

