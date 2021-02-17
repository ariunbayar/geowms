import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

export const service = {
    get,
    set
}

const prefix = '/back/api/covid'

function get() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get/`, opts).then(handleResponse)
}

function set(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/set/`, opts).then(handleResponse)
}
