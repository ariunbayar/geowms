import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    browserCount,
    pageCount,
    loginAll,
    loginDateCount,
    loginSearch,
    logoutDateCount,
    pageUserCount,
    crudMethodCount,
    crudDateCount,
    crudList,
    pageList,
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

function pageList(page, perpage, query){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query }),
    }
    return fetch(`${prefix}/log/page-list/`, requestOptions).then(handleResponse)
}

function crudList(page, perpage, query){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query }),
    }
    return fetch(`${prefix}/log/crud-list/`, requestOptions).then(handleResponse)
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

function crudMethodCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-method-count/`, requestOptions).then(handleResponse)
}

function crudDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-date-count/`, requestOptions).then(handleResponse)
}
