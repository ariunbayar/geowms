import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
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
    getSelectValue,
    getAllOrg,
}

const prefix = "/gov/api/role/employee"
const prefix_role = '/gov/api/role'

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

function updateEmployee(user_detail, role_id, id, add_perm, remove_perm, address ) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ user_detail, role_id, id, add_perm, remove_perm, address })
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

function getAddresses(choose, value) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({choose, value}),
    }
    return fetch(`${prefix}/addresses/`, requestOptions).then(handleResponse)
}

function formOptions() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/api/aimag/`, requestOptions).then(handleResponse)
}

function getEmpInfo(id, is_erguul) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ is_erguul }),
    }
    return fetch(`/back/api/org/${id}/emp-info/`, requestOptions).then(handleResponse)
}

function getErguulegFields(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/back/api/org/${id}/erguuleg-fields/`, requestOptions).then(handleResponse)
}

function saveErguul(values, emp_id, point, photo, erguul_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values, emp_id, point, photo, erguul_id }),
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

function getSelectValue() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/back/api/org/get-select-values/`, requestOptions).then(handleResponse)
}

function getAllOrg() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/back/api/org/get-all-org/`, requestOptions).then(handleResponse)
}
