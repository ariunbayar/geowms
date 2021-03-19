import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'

export const service = {
    getDashboard,
    getDashboardFromId,
}

const prefix = '/gov'

function getDashboard() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-covid-dashboard/`, requestOptions).then(handleResponse)
}

function getDashboardFromId(geo_id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-covid-dashboard-id/${geo_id}/`, requestOptions).then(handleResponse)
}

