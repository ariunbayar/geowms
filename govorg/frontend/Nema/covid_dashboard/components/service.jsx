import { handleResponse, getGetOptions, getPostOptions } from '../../../components/helpers/service'

export const service = {
    getState,
    getDataDashboard,
    get_geo_data
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

function get_geo_data(geo_id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/covid/${geo_id}/geo_data/`, requestOptions).then(handleResponse)
}
