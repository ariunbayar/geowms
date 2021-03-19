import {handleResponse, getPostOptions, getGetOptions} from '../../../helpers/service'



export const service = {
    get_geo_data
}

const prefix = '/covid'

function get_geo_data(geo_id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${geo_id}/geo_data/`, requestOptions).then(handleResponse)
}