import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    browserCount,
    browserLoginCount
}


const prefix = '/back/api'

function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/`, requestOptions).then(handleResponse)
}

function browserCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/browser-count/`, requestOptions).then(handleResponse)
}

function browserLoginCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/browser-login/`, requestOptions).then(handleResponse)
}