import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    getListEmployee,
    createEmployee,
    getRole,
    getRoleList,
    getDetailEmployee,
    deleteEmployee,
    updateEmployee,
    empTokenRefresh,
    sendMail
}

const prefix = "/gov/api/role/employee"
const prefix_role = '/gov/api/role'

function getListEmployee() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function createEmployee(user_detail, emp_role_id, roles) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ user_detail, emp_role_id, roles })
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

function updateEmployee(username, first_name, last_name, position, email, gender, register, is_admin, role_id, id, add_perm, remove_perm) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ username, first_name, last_name, position, email, gender, register, is_admin, role_id, id, add_perm, remove_perm })
    }

    return fetch(`${prefix}/${id}/update/`, requestOptions).then(handleResponse)
}

function empTokenRefresh(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/refresh-token/`, requestOptions).then(handleResponse)
}

function sendMail() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/send-mail/`, requestOptions).then(handleResponse)
}