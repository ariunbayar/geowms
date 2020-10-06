import {handleResponse, getGetOptions} from '../Components/helpers/service'


export const service = {
    geom,
    rows,
    remove
}


function geom() {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/`, requestOptions).then(handleResponse)
}


function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/rows/`, requestOptions).then(handleResponse)
}

function remove(id) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${id}/remove/`, requestOptions).then(handleResponse)
}
