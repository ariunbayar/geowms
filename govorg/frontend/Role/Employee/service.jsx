import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    getListEmployee,
    createEmployee,
    getRole,
    getRoleList,
    getDetailEmployee,
    deleteEmployee,
    updateEmployee,
}

const prefix = "/gov/api/role/employee"
const prefix_role = '/gov/api/role'

function getListEmployee() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function createEmployee(first_name, last_name, email, position, is_admin, emp_role_id, roles) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ first_name, last_name, email, position, is_admin, emp_role_id, roles })
    }

    return fetch(`${prefix}/create/`, requestOptions).then(handleResponse)
}

function getRole(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix_role}/${id}/detail/`, requestOptions).then(handleResponse)
}

function getRoleList() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix_role}/`, requestOptions).then(handleResponse)
}

function getDetailEmployee(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/detail/`, requestOptions).then(handleResponse)
}

function deleteEmployee(id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/delete/`, requestOptions).then(handleResponse)
}

function updateEmployee(id, first_name, last_name, email, position, is_admin, emp_role_id, add_perm, remove_perm) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ first_name, last_name, email, position, is_admin, emp_role_id, add_perm, remove_perm })
    }

    return fetch(`${prefix}/${id}/update/`, requestOptions).then(handleResponse)
}
