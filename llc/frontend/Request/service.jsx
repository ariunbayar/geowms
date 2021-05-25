import {handleResponse, getGetOptions, getPostOptions} from '../helpers/service'
export const service = {
    SaveRequest
}

const prefix = '/llc/backend'

function SaveRequest(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas
    }

    return fetch(`${prefix}/save-request/`, opts).then(handleResponse)
}