import { handleResponse, getGetOptions, getPostOptions } from './components/helpers/service'


export const service = {
    tableListTeevriinSuljee,
    tableListBairZuinZurag,
    tableListBarilgaSuurinGazar,
    tableListDedButets,
    getCount,
    detail,
    updatePassword,
    getEmpRoles,
    getApproveAndRevoke,
}

function tableListTeevriinSuljee() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/teevriin_suljee/table_list/', requestOptions).then(handleResponse)
}

function tableListBairZuinZurag() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/bair_zuin_zurag/table_list/', requestOptions).then(handleResponse)
}

function tableListBarilgaSuurinGazar() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/barilga_suurin_gazar/table_list/', requestOptions).then(handleResponse)
}


function tableListDedButets() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/ded_butets/table_list/', requestOptions).then(handleResponse)
}

function getCount() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`/gov/api/org-request/getCount/`, requestOptions).then(handleResponse)
}

function detail() {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/profile/api/info/`, opts).then(handleResponse)
}

function updatePassword(new_password, old_password, re_password) {
    const requestOptions = {
        ...getPostOptions(),
          body: JSON.stringify({ new_password, old_password, re_password }),
    }
    return fetch(`/profile/api/update-password/`, requestOptions).then(handleResponse)
}

function getEmpRoles() {
    const requestOptions = getGetOptions()
    return fetch('/gov/emp-role/', requestOptions).then(handleResponse)
}

function getApproveAndRevoke() {
    const requestOptions = getGetOptions()
    return fetch('/gov/get_approve_and_revoke/', requestOptions).then(handleResponse)
}