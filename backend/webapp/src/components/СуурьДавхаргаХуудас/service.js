import {handleResponse, getGetOptions, getPostOptions} from '../../helpers/service'


export const service = {
    getAll,
    getDetail,
    create,
    remove,
    swap,
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


function swap(swap_one, swap_two) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({swap_one, swap_two}),
    }

    return fetch(`${prefix}/swap/`, opts).then(handleResponse)
}

function remove(id) {
    const opts = {
        ...getPostOptions(),
    }

    return fetch(`${prefix}/${id}/устгах/`, opts).then(handleResponse)
}
