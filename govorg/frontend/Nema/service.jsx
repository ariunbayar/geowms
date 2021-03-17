import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'



export const service = {
    create_nema_layer,
    getDetialAll,
    getNema,
    covidConfigGet,
    remove
}

const prefix = '/gov/api/nema'

function covidConfigGet() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/back/api/config/covid/', requestOptions).then(handleResponse)
}

function remove(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/remove/${id}/`, requestOptions).then(handleResponse)
}

function create_nema_layer(values, id){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values, id}),
    }
    return fetch(`${prefix}/create/`, requestOptions).then(handleResponse)
}

function getDetialAll(id) {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/${id}/detail/`, requestOptions).then(handleResponse)
}


function getNema() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/covid/get-nema/', requestOptions).then(handleResponse)
}
