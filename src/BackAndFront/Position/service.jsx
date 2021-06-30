import { handleResponse, getGetOptions, getPostOptions } from "@helpUtils/handleRequest"

export const service = {
    getRequest,
    postRequest,
}

function getRequest( link ){
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(link, requestOptions).then(handleResponse)
}

function postRequest( link, payload ) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify( payload ),
    }
    return fetch(link, requestOptions).then(handleResponse)
}
