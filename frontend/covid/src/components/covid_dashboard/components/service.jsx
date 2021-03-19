import {getGetOptions, getPostOptions, handleResponse} from '../../../helpers/service'

export const service = {
    getState,
    getDataDashboard,
}

function getState(geo_id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/covid/get-covid-state/${geo_id}/`, requestOptions).then(handleResponse)
}

function getDataDashboard() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/covid/get-data-dashboard/`, requestOptions).then(handleResponse)
}
