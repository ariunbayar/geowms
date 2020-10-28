import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'
export const service = {
    getAll,
}

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/org-request/`, requestOptions).then(handleResponse)
}
