import {getGetOptions, getPostOptions, handleResponse} from '../helpers/service'

export const service = {
    getDetails,
}

const prefix = '/profile/api'

function getDetails(id){
    const requestOptions = {...getPostOptions(),
        body: JSON.stringify({id})}
    return fetch(`${prefix}/get-details/`, requestOptions).then(handleResponse)
}