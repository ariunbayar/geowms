import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    geom,
    rows,
    remove,
    save,
    detail,
    update,
    geomUpdate,
    geomAdd
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
        ...getGetOptions(),
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

function update(oid, data, pk) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(data),
    }
    return fetch(`/gov/api/ded_butets/${oid}/${pk}/save/`, opts).then(handleResponse)
}

function geomUpdate(geojson, oid, pk) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson}),
    }
    return fetch(`/gov/api/ded_butets/${oid}/${pk}/geom-update/`, opts).then(handleResponse)
}

function geomAdd(geojson, oid) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson}),
    }
    return fetch(`/gov/api/ded_butets/${oid}/add-geom/`, opts).then(handleResponse)
}