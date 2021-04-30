import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    revokeState,
    paginatedList,
    getChoices,
}

const prefix = '/gov/api/revoke_request'


function getChoices() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/get_choices/`, requestOptions).then(handleResponse)
}


function revokeState(id, state) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ id, state })
    }
    return fetch(`${prefix}/revoke-change-state/`, requestOptions).then(handleResponse)
}


function paginatedList(page, per_page, query, state) {
    const requestOptions = {...getPostOptions(),
        body: JSON.stringify({ page, per_page, query, state }),
    }

    return fetch(`${prefix}/revoke-search/`, requestOptions).then(handleResponse)
}


