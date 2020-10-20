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


function rows(pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${pid}/${fid}/rows/`, requestOptions).then(handleResponse)
}

function geomType(pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/barilga_suurin_gazar/${pid}/${fid}/geom-type/`, requestOptions).then(handleResponse)
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

function detail(oid, id) {

    const opts = getGetOptions()

    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/${id}/detail/`, opts).then(handleResponse)
}

function sendFeature(data, oid, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({data, id}),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${oid}/save/`, opts).then(handleResponse)
}

function geomUpdate(geojson, fid, id) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson, fid, id}),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${fid}/geom-update/`, opts).then(handleResponse)
}

function geomAdd(geojson, fid) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson}),
    }
    return fetch(`/gov/api/barilga_suurin_gazar/${fid}/add-geom/`, opts).then(handleResponse)
}