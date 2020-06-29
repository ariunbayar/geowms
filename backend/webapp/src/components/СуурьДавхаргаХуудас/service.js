import {handleResponse, getGetOptions, getPostOptions} from '@/helpers/service'


export const service = {
    getAll,
    getDetail,
    create,
    remove,
    move,
}

const prefix = '/back/api/суурь-давхарга'

function getAll() {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/`, opts).then(handleResponse)
}

function getDetail(id) {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/${id}/detail/`, opts).then(handleResponse)
}

function create(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/үүсгэх/`, opts).then(handleResponse)
}


function move(id, move) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, move}),
    }

    return fetch(`${prefix}/move/`, opts).then(handleResponse)
}

function remove(id) {
    const opts = {
        ...getPostOptions(),
    }

    return fetch(`${prefix}/${id}/устгах/`, opts).then(handleResponse)
}
