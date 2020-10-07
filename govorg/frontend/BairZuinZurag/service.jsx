import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    geom,
    rows,
    remove,
    save,
}

function geom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/bair_zuin_zurag/`, requestOptions).then(handleResponse)
}


function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/bair_zuin_zurag/${oid}/rows/`, requestOptions).then(handleResponse)
}

function remove(oid, id) {

    const opts = {
        ...getPostOptions(),
        body: '{}',
    }

    return fetch(`/gov/api/bair_zuin_zurag/${oid}/remove/`, opts).then(handleResponse)
}

function save(oid, values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/bair_zuin_zurag/${oid}/add/`, opts).then(handleResponse)
}
