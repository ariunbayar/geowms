import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getFields,
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