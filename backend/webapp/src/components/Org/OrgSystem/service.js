import {getGetOptions, getPostOptions, handleResponse} from '../../../helpers/service'

export const service = {
    getAll,
    create,
    update,
    remove,
    detail,
    getWMSList,
    govorgSearch
  
}


const prefix = '/back/api/систем'


function getAll(last,first,org_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({last,first,org_id}),
    }
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}


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

function govorgSearch(query) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/govorgSearch/`, requestOptions).then(handleResponse)
}