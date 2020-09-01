import {getGetOptions, getPostOptions, handleResponse} from '../../../helpers/service'

export const service = {
    create,
    update,
    remove,
    detail,
    getWMSList,
    govorgList,
}   


const prefix = '/back/api/систем'


function create(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/үүсгэх/`, opts).then(handleResponse)
}


function update(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/${values.id}/хадгалах/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {
        ...getPostOptions(),
    }

    return fetch(`${prefix}/${id}/устгах/`, opts).then(handleResponse)
}


function detail(id) {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/${id}/дэлгэрэнгүй/`, opts).then(handleResponse)
}


function getWMSList() {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/back/wms/all/`, opts).then(handleResponse)
}

function govorgList(page, perpage, query, org_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage, query, org_id}),
    }
    return fetch(`${prefix}/govorgList/`, requestOptions).then(handleResponse)
}