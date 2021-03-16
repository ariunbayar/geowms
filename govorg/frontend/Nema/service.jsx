import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'



export const service = {
    create_nema_layer
}

const prefix = '/gov/api/nema'

function create_nema_layer(values){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({values}),
    }
    return fetch(`${prefix}/create/`, requestOptions).then(handleResponse)
}
