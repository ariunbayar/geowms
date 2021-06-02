import {handleResponse, getGetOptions, getPostOptions} from '../helpers/service'
export const service = {
    SaveRequest,
    handleRequestData,
    getToolDatas,
    SendRequest,
    RemoveRequest
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

function getToolDatas(regis_number) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({regis_number})
    }
    return fetch(`/llc/get_tool_datas/`, opts).then(handleResponse)
}

function SendRequest(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/send-request/`, opts).then(handleResponse)
}

function RemoveRequest(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/remove-request/`, opts).then(handleResponse)
}
