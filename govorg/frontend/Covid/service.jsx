import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'

export const service = {
    getDashboard,
    getDashboardFromId,
    formOptions,
    saveDashboard,
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

function formOptions() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/api/aimag/', requestOptions).then(handleResponse)
}

function saveDashboard(values, geo_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values, geo_id })
    }
    return fetch(`${prefix}/save-covid-dashboard/`, requestOptions).then(handleResponse)
}

