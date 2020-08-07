import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    browserCount,
    pageCount,
    pageAll,
    loginAll,
    CrudEventAll,
    loginDateCount,
    loginSearch,
    logoutDateCount,
    pageUserCount,
    crudMethodCount,
    crudDateCount,
    pageSearch,
    crudSearch

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

function pageSearch(query) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/log/page-search/`, requestOptions).then(handleResponse)
}

function pageAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/page-all/`, requestOptions).then(handleResponse)
}

function loginDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function loginSearch(query) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/log/login-search/`, requestOptions).then(handleResponse)
}

function logoutDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function loginAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-all/`, requestOptions).then(handleResponse)
}

function CrudEventAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-event-all/`, requestOptions).then(handleResponse)
}

function crudMethodCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-method-count/`, requestOptions).then(handleResponse)
}

function crudDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-date-count/`, requestOptions).then(handleResponse)
}

function crudSearch(query) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/log/crud-search/`, requestOptions).then(handleResponse)
}