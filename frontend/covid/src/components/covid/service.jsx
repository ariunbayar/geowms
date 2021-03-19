import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

export const service = {
    covidConfigGet,
    getErguulEmployees,
    formOptions,
    getGeom,
    getNema,
}

function covidConfigGet() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/back/api/config/covid/', requestOptions).then(handleResponse)
}

function getErguulEmployees() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/back/api/org/get-erguul/', requestOptions).then(handleResponse)
}

function formOptions() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/api/aimag/', requestOptions).then(handleResponse)
}

function getGeom(geo_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({geo_id}),
    }
    return fetch('/payment/get-geom/', requestOptions).then(handleResponse)
}

function getNema(bundle_id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/covid/get-nema/${bundle_id}/`, requestOptions).then(handleResponse)
}
