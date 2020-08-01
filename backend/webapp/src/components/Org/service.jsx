import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    org_add,
    org_remove
}


const prefix = '/back/api/org'


function getAll(level) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/`, requestOptions).then(handleResponse)
}


function org_add(level, org_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({org_name}),
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
