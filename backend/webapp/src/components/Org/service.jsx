import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    org_add,
    org_remove,
    roles,
    rolesSave,
    OrgAll,
}


const prefix = '/back/api/org'


function getAll(level) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/`, requestOptions).then(handleResponse)
}
function OrgAll(level,id){
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/${id}/`, requestOptions).then(handleResponse)
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
