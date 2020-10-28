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
    geomType,
    getRole,
    detailNone,
    create,
    createUpd,
    createDel
}


function geom() {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/inspire/`, requestOptions).then(handleResponse)
}

function getRole(pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/inspire/${pid}/${fid}/getRoles/`, requestOptions).then(handleResponse)
}

function rows(pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/inspire/${pid}/${fid}/rows/`, requestOptions).then(handleResponse)
}

function geomType(pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`/gov/api/inspire/${pid}/${fid}/geom-type/`, requestOptions).then(handleResponse)
}

function remove(pid, fid, gid) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({gid}),
    }
    return fetch(`/gov/api/inspire/${pid}/${fid}/remove/`, opts).then(handleResponse)
}

function save(oid, values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/gov/api/inspire/${oid}/add/`, opts).then(handleResponse)
}

function update(data, pid, fid) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(data),
    }
    return fetch(`/gov/api/inspire/${pid}/${fid}/save/`, opts).then(handleResponse)
}

function detail(gid, fid) {
    const opts = getGetOptions()

    return fetch(`/gov/api/inspire/${gid}/${fid}/detail/`, opts).then(handleResponse)
}

function detailNone(tid, pid, fid) {
    const opts = getGetOptions()

    return fetch(`/gov/api/inspire/${tid}/${pid}/${fid}/detail/`, opts).then(handleResponse)
}

function sendFeature(data, oid, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({data, id}),
    }
    return fetch(`/gov/api/inspire/${oid}/save/`, opts).then(handleResponse)
}

function geomUpdate(geojson, fid, id) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson, fid, id}),
    }
    return fetch(`/gov/api/inspire/${fid}/geom-update/`, opts).then(handleResponse)
}

function geomAdd(geojson, fid) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson}),
    }
    return fetch(`/gov/api/inspire/${fid}/add-geom/`, opts).then(handleResponse)
}

function create(tid, pid, fid, form_json, geo_json) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tid, pid, fid, form_json, geo_json}),
    }
    return fetch(`/gov/api/inspire/create/`, opts).then(handleResponse)
}

function createUpd(tid, pid, fid, form_json, geo_json, old_geo_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tid, pid, fid, form_json, geo_json, old_geo_id}),
    }
    return fetch(`/gov/api/inspire/createUpd/`, opts).then(handleResponse)
}

function createDel(tid, pid, fid, old_geo_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tid, pid, fid, old_geo_id}),
    }
    return fetch(`/gov/api/inspire/createDel/`, opts).then(handleResponse)
}