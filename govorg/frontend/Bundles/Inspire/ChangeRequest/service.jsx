import {handleResponse, getGetOptions} from '../../../components/helpers/service'
export const service = {
    getAll,
}

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/org-request/change-request/`, requestOptions).then(handleResponse)
}
