import {handleResponse, getGetOptions, getPostOptions} from '../helpers/service'
export const service = {
    SaveRequest,
    handleRequestData
}

const prefix = '/llc/backend'

function SaveRequest(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas
    }

    return fetch(`${prefix}/save-request/`, opts).then(handleResponse)
}

function handleRequestData(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/get-request-data/`, opts).then(handleResponse)
}
