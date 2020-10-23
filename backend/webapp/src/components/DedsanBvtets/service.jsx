import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getprop,
    editName,
    getFields
}

const prefix = '/back/dedsan-butests'

function getall() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, opts).then(handleResponse)
}

function getprop(code) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/prop/${code}/`, opts).then(handleResponse)
}

function editName(id, name){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ id, name }),
    }
    return fetch(`${prefix}/editName/`, opts).then(handleResponse)
}

function getFields(name){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ name }),
    }
    return fetch(`${prefix}/get-fields/`, opts).then(handleResponse)
}