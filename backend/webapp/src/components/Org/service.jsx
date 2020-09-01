import {handleResponse,getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    org_add,
    org_remove,
    roles,
    rolesSave,
    employee_add,
    employee_remove,
    employeeMore,
    employee_update,
    sistemCount,
    employee_list,
    orgList,
    orgAll,
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


function roles(level, org_id) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/${org_id}/roles/`, requestOptions).then(handleResponse)
}

function rolesSave(level, org_id, org_roles) {
    const opts = {
        ...getPostOptions(),
           body: JSON.stringify(org_roles),
    }
    return fetch(`${prefix}/level-${level}/${org_id}/roles-save/`, opts).then(handleResponse)
}

function employeeMore(level, org_id, org_emp) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/${org_id}/employee-more-${org_emp}/`, requestOptions).then(handleResponse)
}

function employee_add(org_level, org_id, payload) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(payload),
    }

    return fetch(`${prefix}/level-${org_level}/${org_id}/employee-add/`, opts).then(handleResponse)
}

function employee_remove(org_level, org_id, user_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({user_id}),
    }

    return fetch(`${prefix}/level-${org_level}/${org_id}/employee-remove/`, opts).then(handleResponse)
}

function employee_update(org_level, org_id, paylaod) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(paylaod),
    }

    return fetch(`${prefix}/level-${org_level}/${org_id}/employee-update/`, opts).then(handleResponse)
}

function orgList(page, perpage, query, org_level) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage, query,org_level}),
    }
    return fetch(`${prefix}/level-${org_level}/org-list/`, opts).then(handleResponse)
}

function orgAll(level,id){
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/${id}/`, requestOptions).then(handleResponse)
}

function employee_list(page, perpage, query, level, org_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage, query, level, org_id}),
    }
    return fetch(`${prefix}/level-${level}/${org_id}/employeeList/`, requestOptions).then(handleResponse)
}
