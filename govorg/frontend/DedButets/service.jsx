import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    geom,
    rows,
    remove,
    save,
    detail,
}

function geom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/ded_butets/`, requestOptions).then(handleResponse)
}


function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/ded_butets/${oid}/rows/`, requestOptions).then(handleResponse)
}

function remove(oid, id) {

    const opts = {
        ...getPostOptions(),
        body: '{}',
    }

    return fetch(`/gov/api/ded_butets/${oid}/${id}/remove/`, opts).then(handleResponse)
}

function save(oid, values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/ded_butets/${oid}/add/`, opts).then(handleResponse)
}

function detail(oid, id) {

    const opts = getGetOptions()

    return fetch(`/gov/api/ded_butets/${oid}/${id}/detail/`, opts).then(handleResponse)
}

function sendFeature(data, oid) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(data),
    }
    return fetch(`/gov/api/ded_butets/${oid}/save/`, opts).then(handleResponse)
}
