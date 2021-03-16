import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'



export const service = {
    create_nema_layer,
    getDetialAll
}

const prefix = '/gov/api/nema'

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