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
    sendMail,
    getGeom,
    getAddresses,
    formOptions,
    getEmpInfo,
    getErguulegFields,
    saveErguul,
    getFieldTailbar,
    saveTailbar,
    getErguul,
}

const prefix = "/gov/api/role/employee"
const prefix_role = '/gov/api/role'

function getListEmployee() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function createEmployee(user_detail, emp_role_id, roles, address) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ user_detail, emp_role_id, roles, address })
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

function updateEmployee(username, first_name, last_name, position, email, gender, register, is_admin, role_id, id, add_perm, remove_perm, address) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ username, first_name, last_name, position, email, gender, register, is_admin, role_id, id, add_perm, remove_perm, address })
    }

    return fetch(`${prefix}/${id}/update/`, requestOptions).then(handleResponse)
}

function empTokenRefresh(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/refresh-token/`, requestOptions).then(handleResponse)
}

function sendMail(username) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({username})
    }
    return fetch(`${prefix}/send-mail/`, requestOptions).then(handleResponse)
}

function getGeom(geo_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({geo_id}),
    }
    return fetch('/payment/get-geom/', requestOptions).then(handleResponse)
}

function getAddresses() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/addresses/`, requestOptions).then(handleResponse)
}

function formOptions() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/api/aimag/`, requestOptions).then(handleResponse)
}

function getEmpInfo(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/back/api/org/${id}/emp-info/`, requestOptions).then(handleResponse)
}

function getErguulegFields() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/back/api/org/erguuleg-fields/`, requestOptions).then(handleResponse)
}

function saveErguul(values, id, point, photo) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values, id, point, photo }),
    }
    return fetch(`/back/api/org/save-erguul/`, requestOptions).then(handleResponse)
}

function getFieldTailbar() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-field-tailbar/`, requestOptions).then(handleResponse)
}

function saveTailbar(values, id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values, id }),
    }
    return fetch(`${prefix}/save-field-tailbar/`, requestOptions).then(handleResponse)
}

function getErguul() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-erguul/`, requestOptions).then(handleResponse)
}
