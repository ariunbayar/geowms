import {getGetOptions,handleResponse} from '../../helpers/service'
export const service ={
    getAll
}

const prefix = '/back/payment'

function getAll() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, requestOptions).then(handleResponse)
}