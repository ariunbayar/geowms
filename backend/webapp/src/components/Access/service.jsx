import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    browserCount,
    pageCount,
    loginDateCount,
    logoutDateCount,
    pageUserCount,
    crudMethodCount,
    crudDateCount,
    WMSDateCount,
    getCarField,
    get_post_detail,
    get_crud_events,
    get_rsp_status,
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

function loginDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function logoutDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/login-date-count/`, requestOptions).then(handleResponse)
}

function crudMethodCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-method-count/`, requestOptions).then(handleResponse)
}

function crudDateCount() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/log/crud-date-count/`, requestOptions).then(handleResponse)
}

function WMSDateCount(){
    const requestOptions = {...getPostOptions()}
    return fetch(`${prefix}/log/wms_date_count/`, requestOptions).then(handleResponse)
}

function getCarField() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/log/get-card-field/`, requestOptions).then(handleResponse)
}

function get_post_detail() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/log/get-post-detail/`, requestOptions).then(handleResponse)
}

function get_crud_events() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/log/get-crud-events/`, requestOptions).then(handleResponse)
}

function get_rsp_status() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/log/get-rsp-status/`, requestOptions).then(handleResponse)
}
