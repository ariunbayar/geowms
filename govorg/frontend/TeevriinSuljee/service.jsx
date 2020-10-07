import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    geom,
    rows,
    remove,
    save,
    detail,
    update
}

function geom() {
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/teevriin_suljee/`, requestOptions).then(handleResponse)
}


function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/teevriin_suljee/${oid}/rows/`, requestOptions).then(handleResponse)
}

function remove(oid, id) {

    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/gov/api/teevriin_suljee/${oid}/${id}/remove/`, opts).then(handleResponse)
}

function save(oid, values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/teevriin_suljee/${oid}/add/`, opts).then(handleResponse)
}

function detail(oid, id) {

    const opts = getGetOptions()

    return fetch(`/gov/api/teevriin_suljee/${oid}/${id}/detail/`, opts).then(handleResponse)
}


function update(oid, data, pk) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(data),
    }
    return fetch(`/gov/api/teevriin_suljee/${oid}/${pk}/save/`, opts).then(handleResponse)
}