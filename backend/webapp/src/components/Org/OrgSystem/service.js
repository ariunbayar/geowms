import { getGetOptions, getPostOptions, handleResponse } from '../../../helpers/service'

export const service = {
    create,
    update,
    remove,
    detail,
    getWMSList,
    tokenRefresh,
    setSystemAtt
}

function create(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/back/api/систем/үүсгэх/`, opts).then(handleResponse)
}

function update(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`/back/api/систем/${values.id}/хадгалах/`, opts).then(handleResponse)
}

function remove(id) {
    const opts = {
        ...getPostOptions(),
    }

    return fetch(`/back/api/систем/${id}/устгах/`, opts).then(handleResponse)
}

function tokenRefresh(id) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`/back/api/систем/${id}/refresh-token/`, opts).then(handleResponse)
}

function detail(id) {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/back/api/систем/${id}/дэлгэрэнгүй/`, opts).then(handleResponse)
}

function getWMSList(org_id) {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/back/wms/all/${org_id}/`, opts).then(handleResponse)
}

function setSystemAtt(array, pk) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({array}),
    }

    return fetch(`/back/api/систем/${pk}/att-save/`, opts).then(handleResponse)
}
