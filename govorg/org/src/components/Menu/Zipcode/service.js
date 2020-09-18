import {handleResponse, getPostOptions, getGetOptions} from '../helpers/service'

const prefix = '/back/tuuhen_ov'

export const service = {
    getAimags,
    getSum,
    getBaga
}
function getAimags() {
    const requestOptions = {
        ...getPostOptions(),
    }
    return fetch('/gov/zip-code/aimag/', requestOptions).then(handleResponse)
}

function getSum(code) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({code})
    }
    return fetch('/gov/zip-code/sum/', requestOptions).then(handleResponse)
}

function getBaga(code) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({code})
    }
    return fetch('/gov/zip-code/bag-horoo/', requestOptions).then(handleResponse)
}