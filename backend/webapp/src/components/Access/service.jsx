import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    browserCount,
    pageCount,
    pageAll,
    loginAll,
    logoutAll,
    loginDateCount,
    logoutDateCount,
    pageUserCount
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

function pageCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/page-date-count/`, requestOptions).then(handleResponse)
}

function pageUserCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/page-user-count/`, requestOptions).then(handleResponse)
}

function pageAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/page-all/`, requestOptions).then(handleResponse)
}

function loginDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function logoutDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function loginAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-all/`, requestOptions).then(handleResponse)
}

function logoutAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/logout-all/`, requestOptions).then(handleResponse)
}
