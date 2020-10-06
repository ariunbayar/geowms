import {handleResponse, getGetOptions, getPostOptions} from '../Components/helpers/service'


export const service = {
    geom,
    rows,
    remove, 
    save,
}


function geom() {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/`, requestOptions).then(handleResponse)
}


function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/rows/`, requestOptions).then(handleResponse)
}

function remove(value, id) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(oid),
    }

    return fetch(`/gov/api/barilga_suurin_gazar/${id}/remove/`, opts).then(handleResponse)
}

function save(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/barilga_suurin_gazar/add/`, opts).then(handleResponse)
}

function detail(values, id) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/barilga_suurin_gazar/${id}/detail/`, opts).then(handleResponse)
}
