import {getGetOptions, handleResponse, getPostOptions} from '../../../helpers/service'

export const service ={
    getGovRoles,
    saveGovRoles
}

const prefix = '/back/api/org'



function getGovRoles(level, org_id){
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/level-${level}/${org_id}/gov-perm/`, requestOptions).then(handleResponse)
}

function saveGovRoles(level, org_id, values){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values}),
    }
    return fetch(`${prefix}/level-${level}/${org_id}/gov-perm/save/`, requestOptions).then(handleResponse)
}
