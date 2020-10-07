import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

const prefix = '/back/tuuhen_ov'

export const service = {
    getAimags,
    getSum,
    getBaga,
    getWmsLayer,
    zipUpdate,
    getZip,
    zipSearch
}

function zipSearch(query, search_table) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query, search_table})
    }
    return fetch('/back/zip-code/search/', requestOptions).then(handleResponse)
}

function getAimags() {
    const requestOptions = {
        ...getPostOptions(),
    }
    return fetch('/back/zip-code/aimag/', requestOptions).then(handleResponse)
}

function getSum(code) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({code})
    }
    return fetch('/back/zip-code/sum/', requestOptions).then(handleResponse)
}

function getBaga(code) {
    console.log(code)
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({code})
    }
    return fetch('/back/zip-code/bag-horoo/', requestOptions).then(handleResponse)
}

function getZip(code) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({code})
    }
    return fetch('/back/zip-code/zip/', requestOptions).then(handleResponse)
}

function getWmsLayer() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/back/zip-code/wms-layer/', requestOptions).then(handleResponse)
}

function zipUpdate(aimag_id, sum_id, baga_id, zip_id, zip_code, zip_code_before) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({aimag_id, sum_id, baga_id, zip_id, zip_code, zip_code_before})
    }
    return fetch('/back/zip-code/zip-update/', requestOptions).then(handleResponse)
}