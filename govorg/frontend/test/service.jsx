import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    getGeom
}

function getGeom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/testGet/`, requestOptions).then(handleResponse)
}