import {handleResponse, getGetOptions, getPostOptions} from '../../components/helpers/service'

class Capabilities {

    constructor(xml_raw) {
        this.xml = (new DOMParser()).parseFromString(xml_raw, "text/xml")
    }

    getLayers() {
        const nodes = this.xml.querySelectorAll('WMS_Capabilities > Capability Layer')
        return [...nodes].map((layer) => {
            return {
                name: layer.querySelector('Title').innerHTML,
                code: layer.querySelector('Name').innerHTML,
            }
        })
    }
}

export const service = {
    geom,
    getWmsLayer,
    remove,
    cancel,
    save,
    detail,
    sendFeature,
    update,
    geomUpdate,
    geomType,
    getRole,
    detailCreate,
    create,
    createUpd,
    createDel,
    sendFile,
    loadWMSLayers,
    searchMeta,
    getMetaData,
    getMetaFields,
    createMeta,
    deleteMeta,
    getLayers,
    qgisGetUrl
}

const prefix = '/gov/api/inspire'
const meta_prefix = '/gov/api/meta-data'

function geom() {
    const requestOptions = getGetOptions()
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function getRole(fid) {
    const requestOptions = getGetOptions()
    return fetch(`${prefix}/${fid}/getRoles/`, requestOptions).then(handleResponse)
}

function getWmsLayer(tid, pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`${prefix}/${tid}/${pid}/${fid}/get-wms-layer/`, requestOptions).then(handleResponse)
}

function geomType(pid, fid) {
    const requestOptions = getGetOptions()
    return fetch(`${prefix}/${pid}/${fid}/geom-type/`, requestOptions).then(handleResponse)
}

function remove(pid, fid, gid) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({gid}),
    }
    return fetch(`${prefix}/${pid}/${fid}/remove/`, opts).then(handleResponse)
}

function cancel(pid, fid, tid, old_geo_id, geo_json, form_json, order_no, order_at) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({pid, fid, tid, old_geo_id, geo_json, form_json, order_no, order_at}),
    }
    return fetch(`/gov/api/revoke_request/revoke-new/`, opts).then(handleResponse)
}

function save(oid, values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/${oid}/add/`, opts).then(handleResponse)
}

function update(data, pid, fid) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(data),
    }
    return fetch(`${prefix}/${pid}/${fid}/save/`, opts).then(handleResponse)
}

function detail(gid, tid, fid) {
    const opts = getGetOptions()
    return fetch(`${prefix}/${gid}/${tid}/${fid}/detailUpdate/`, opts).then(handleResponse)

}

function detailCreate(tid, pid, fid) {
    const opts = getGetOptions()
    return fetch(`${prefix}/${tid}/${pid}/${fid}/detailCreate/`, opts).then(handleResponse)
}

function sendFeature(data, oid, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({data, id}),
    }
    return fetch(`${prefix}/${oid}/save/`, opts).then(handleResponse)
}

function geomUpdate(geojson, fid, id) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({geojson, fid, id}),
    }
    return fetch(`${prefix}/${fid}/geom-update/`, opts).then(handleResponse)
}

function create(tid, pid, fid, form_json, geo_json) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tid, pid, fid, form_json, geo_json}),
    }
    return fetch(`${prefix}/create/`, opts).then(handleResponse)
}

function createUpd(tid, pid, fid, form_json, geo_json, old_geo_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tid, pid, fid, form_json, geo_json, old_geo_id}),
    }
    return fetch(`${prefix}/createUpd/`, opts).then(handleResponse)
}

function createDel(tid, pid, fid, old_geo_id, form_json) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tid, pid, fid, old_geo_id, form_json}),
    }
    return fetch(`${prefix}/createDel/`, opts).then(handleResponse)
}

function sendFile(formData, fid, tid, name, pid){
    const opts = {
        ...getPostOptions(),
        body: formData,
    }
    return fetch(`${prefix}/send-data/${tid}/${pid}/${fid}/${name}/`, opts).then(handleResponse)
}

function loadWMSLayers(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/дэд-сан/${id}/давхаргууд/`, requestOptions).then(handleResponse)
}

function searchMeta(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${meta_prefix}/${pk}/detail/`, requestOptions).then(handleResponse)
}

function getMetaData() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${meta_prefix}/`, requestOptions).then(handleResponse)
}

function getMetaFields() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${meta_prefix}/get-fields/`, requestOptions).then(handleResponse)
}

function createMeta(meta_data, geom_ids) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ meta_data, geom_ids })
    }
    return fetch(`${meta_prefix}/create/`, requestOptions).then(handleResponse)
}

function deleteMeta(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${meta_prefix}/${pk}/delete/`, requestOptions).then(handleResponse)
}

function getLayers(emp_perm_prefix) {

    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'GET',
        }
        const url = emp_perm_prefix + '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities'
        fetch(url, requestOptions)
            .then(rsp => rsp.blob())
            .then(data => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const layers = (new Capabilities(reader.result)).getLayers()
                    resolve(layers)
                }
                reader.readAsText(data)
            })
            .catch(reject)
    })
}
function qgisGetUrl() {
    const requestOptions = getGetOptions()
    return fetch(`${prefix}/qgis-url/`, requestOptions).then(handleResponse)
}
