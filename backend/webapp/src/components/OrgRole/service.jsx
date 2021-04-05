import {getGetOptions, handleResponse, getPostOptions} from '../../helpers/service'

export const service ={
    createPerm,
    getInspireRoles,
    saveInspireRoles
}

const prefix = '/back/api/org'

function createPerm(values){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/create-perm/`, requestOptions).then(handleResponse)
}


function getInspireRoles(id){
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/inspire-roles/${id}/`, requestOptions).then(handleResponse)
}

function saveInspireRoles(id, values){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values}),
    }
    return fetch(`${prefix}/inspire-roles/${id}/save/`, requestOptions).then(handleResponse)
}