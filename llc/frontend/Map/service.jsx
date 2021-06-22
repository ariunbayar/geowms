import {getGetOptions, getPostOptions, handleResponse} from '../helpers/service'

const prefix = '/llc/backend'


export const service = {
    getAllGeoJson
}

function getAllGeoJson() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-all-geo_json/`, requestOptions).then(handleResponse)
}


