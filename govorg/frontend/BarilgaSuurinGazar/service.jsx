import {handleResponse, getGetOptions, getPostOptions} from '../Components/helpers/service'


export const service = {
    geom,
    rows,
    remove,
    save,
    detail,
    sendFeature,
    update,
    geomUpdate,
    geomAdd,
    geomType
}


function geom() {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/`, requestOptions).then(handleResponse)
}


function rows(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/rows/`, requestOptions).then(handleResponse)
}

function geomType(oid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/geom-type/`, requestOptions).then(handleResponse)
}

function remove(oid, id) {

    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/${id}/remove/`, opts).then(handleResponse)
}

function save(oid, values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/add/`, opts).then(handleResponse)
}

function update(oid, data, pk) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(data),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/${pk}/save/`, opts).then(handleResponse)
}

function detail(gid) {
    const opts = getGetOptions()

    return fetch(`/gov/api/barilga_suurin_gazar/${gid}/detail/`, opts).then(handleResponse)
}

function sendFeature(data, oid, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({data, id}),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/save/`, opts).then(handleResponse)
}

function geomUpdate(geojson, oid, pk) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson}),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/${pk}/geom-update/`, opts).then(handleResponse)
}

function geomAdd(geojson, oid) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson}),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/add-geom/`, opts).then(handleResponse)
}