import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    geom
}

function geom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/barilga_suurin_gazar/`, requestOptions).then(handleResponse)
}