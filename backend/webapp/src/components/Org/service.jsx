import {handleResponse, getGetOptions, getPostOptions, getCookie} from '../../helpers/service'

export const service = {
    getAll,
    org_add,
    update
}


const prefix = '/back/api/org'


function getAll(level) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/`, requestOptions).then(handleResponse)
}

function update(level) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/level-${level}/`, requestOptions).then(handleResponse)
}

function org_add(level, org_name) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify({org_name}),
    }

    return fetch(`${prefix}/level-${level}/org-add/`, opts).then(handleResponse)
}

