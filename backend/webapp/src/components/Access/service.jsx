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
    const requestOptions = {
        ...getGettOptions(),
    }
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

function pageSearch(query, last, first) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query, last, first}),
    }
    return fetch(`${prefix}/log/page-search/`, requestOptions).then(handleResponse)
}

function pageAll(last, first) {
    const requestOptions = {...getPostOptions(),
        body: JSON.stringify({last, first})}
    return fetch(`${prefix}/log/page-all/`, requestOptions).then(handleResponse)
}

function loginDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function loginSearch(query, last, first) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query, last, first}),
    }
    return fetch(`${prefix}/log/login-search/`, requestOptions).then(handleResponse)
}

function logoutDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function loginAll(last,first) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({last, first})
    }
    return fetch(`${prefix}/log/login-all/`, requestOptions).then(handleResponse)
}

function CrudEventAll(last,first) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({last, first})
    }
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

function crudSearch(query, last, first) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query, last, first}),
    }
    return fetch(`${prefix}/log/crud-search/`, requestOptions).then(handleResponse)
}