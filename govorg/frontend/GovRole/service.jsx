import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'

export const service = {
    roles
}

function roles() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/bundle/`, requestOptions).then(handleResponse)
}
