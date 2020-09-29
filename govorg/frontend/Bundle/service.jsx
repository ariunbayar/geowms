import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    roles
}

function roles() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/bundle/`, requestOptions).then(handleResponse)
}