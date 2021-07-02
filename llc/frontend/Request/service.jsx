import { handleResponse, getGetOptions, getPostOptions } from '../helpers/service'
export const service = {
    saveRequest,
    handleRequestData,
    getToolDatas,
    sendRequest,
    removeRequest,
    getSearchItems,
    getCount,
}

const prefix = '/llc/backend'

function saveRequest(form_datas) {
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

function getToolDatas() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`/llc/get_tool_datas/`, opts).then(handleResponse)
}

function getCount() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get_count/`, opts).then(handleResponse)
}

function sendRequest(id, mergejilten) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({mergejilten})
    }

    return fetch(`${prefix}/${id}/send-request/`, opts).then(handleResponse)

}

function removeRequest(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/remove-request/`, opts).then(handleResponse)
}

function getSearchItems() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-search-field/`, opts).then(handleResponse)
}

