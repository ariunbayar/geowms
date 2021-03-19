import {getGetOptions, getPostOptions, handleResponse} from '../../../helpers/service'

export const service = {
    getState,
}

function getState(geo_id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/covid/get-covid-state/${geo_id}/`, requestOptions).then(handleResponse)
}
