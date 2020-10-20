import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getFields,
    getProperties,
    getprop
}

const prefix = '/back/dedsan-butests'

function getall() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, opts).then(handleResponse)
}

function getFields(id, name) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/getFields/${id}/${name}/`, opts).then(handleResponse)
}

function getProperties(id, name, code) {
    const opts = {
        ...getPostOptions(),
        body: code,
    }
    return fetch(`${prefix}/getProperties/${id}/${name}/${code}/`, opts).then(handleResponse)
}

function getprop(code) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/prop/${code}/`, opts).then(handleResponse)
}