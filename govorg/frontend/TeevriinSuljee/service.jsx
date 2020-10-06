import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    geom,
    getGeom,
    rows,
}

function geom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/teevriin_suljee/`, requestOptions).then(handleResponse)
}


function getGeom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/testGet/`, requestOptions).then(handleResponse)
}

function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/teevriin_suljee/${oid}/rows/`, requestOptions).then(handleResponse)
}
