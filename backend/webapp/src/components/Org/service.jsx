import {handleResponse,getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    org_add,
    org_remove,
    employeeAdd,
    employeeRemove,
    employeeDetail,
    employeeUpdate,
    empTokenRefresh,
    sistemCount,
    employee_list,
    orgList,
    orgAll,
    getBaseLayers,
    formOptions,
    getGeom,
}


const prefix = '/back/api/org'

function sistemCount(id) {
    const opts = {...getGetOptions()}
    return fetch(`/back/api/систем/${id}/тоо/`, opts).then(handleResponse)
}

function getAll(level,value) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify(value),
    }
    return fetch(`${prefix}/level-${level}/`, requestOptions).then(handleResponse)
}

function org_add(level, values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/level-${level}/org-add/`, opts).then(handleResponse)
}


function org_remove(level, org_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({org_id}),
    }
    return fetch(`${prefix}/level-${level}/org-remove/`, opts).then(handleResponse)
}

function employeeDetail(pk) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/employee-detail-${pk}/`, requestOptions).then(handleResponse)
}

function employeeAdd(org_level, org_id, payload) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(payload),
    }

    return fetch(`${prefix}/level-${org_level}/${org_id}/employee-add/`, opts).then(handleResponse)
}

function employeeRemove(pk) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/employee-remove-${pk}/`, opts).then(handleResponse)
}

function employeeUpdate(pk, level, paylaod) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(paylaod),
    }

    return fetch(`${prefix}/level-${level}/employee-update-${pk}/`, opts).then(handleResponse)
}

function empTokenRefresh(pk) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/employee-token-refresh-${pk}/`, opts).then(handleResponse)
}

function orgList(page, perpage, query, org_level, sort_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage, query,org_level, sort_name}),
    }
    return fetch(`${prefix}/level-${org_level}/org-list/`, opts).then(handleResponse)
}

function orgAll(level, id) {
    const requestOptions = {...getGetOptions()}
    return fetch(`/back/api/org/level-${level}/${id}/`, requestOptions).then(handleResponse)
}

function employee_list(page, perpage, query, level, org_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage, query, level, org_id}),
    }
    return fetch(`${prefix}/level-${level}/${org_id}/employeeList/`, requestOptions).then(handleResponse)
}

function formOptions(option) {
    const opts = getGetOptions()
    return fetch(`/back/api/org/form-options/${option}/`, opts).then(handleResponse)
}

function getBaseLayers() {
    const opts = getGetOptions()
    return fetch('/суурь-давхарга/', opts).then(handleResponse)
}

function getGeom(geo_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({geo_id}),
    }
    return fetch('/payment/get-geom/', requestOptions).then(handleResponse)
}
