import {handleResponse, getGetOptions, getPostOptions} from '@/helpers/service'


export const service = {
    getAll,
    create,
    remove,
}

const prefix = '/back/api/суурь-давхарга'

function getAll() {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/`, opts).then(handleResponse)
}

function create(values) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/үүсгэх/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {
        ...getPostOptions(),
    }

    return fetch(`${prefix}/${id}/устгах/`, opts).then(handleResponse)
}
