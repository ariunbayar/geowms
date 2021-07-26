import {getGetOptions, handleResponse} from '@helpUtils/handleRequest'

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


