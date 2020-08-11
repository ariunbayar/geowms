import {getGetOptions, getPostOptions, handleResponse} from '../service'

export const service ={
    getAll
}

const prefix = '/back/log/'


function getAll() {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({}),
    }
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}