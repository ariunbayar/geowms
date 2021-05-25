import {handleResponse, getGetOptions, getPostOptions} from '../components/helpers/service'
export const service = {
    SaveRequest
}

const prefix = '/llc'

function SaveRequest(request_text) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ request_text})
    }

    return fetch(`${prefix}/save_requests/`, requestOptions).then(handleResponse)
}
