import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

export const service = {
    getDetails,
}

const prefix = '/profile/api'

function getDetails(id){
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/${id}/get-details/`, requestOptions).then(handleResponse)
}