
import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    createRole,
    updateRole,
    deleteRole,
    detailRole,
    getRoleList,
}

const prefix = '/gov/api/role'

function getRoleList() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function createRole(gov_perm_id, role_name, role_description, roles){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ gov_perm_id, role_name, role_description, roles })
    }

    return fetch(`${prefix}/create/`, requestOptions).then(handleResponse)
}

function updateRole(id, gov_perm_id, role_name, role_description, remove_roles, add_roles) {
    console.log(id, gov_perm_id, role_name, role_description, remove_roles, add_roles);
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ gov_perm_id, role_name, role_description, remove_roles, add_roles })
    }

    return fetch(`${prefix}/${id}/update/`, requestOptions).then(handleResponse)
}

function deleteRole(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/delete/`, requestOptions).then(handleResponse)
}

function detailRole(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/detail/`, requestOptions).then(handleResponse)
}