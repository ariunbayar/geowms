import {getGetOptions, handleResponse, getPostOptions} from '../../helpers/service'

export const service = {
    paginatedList,
}

const prefix = '/back/api/error500'

function paginatedList(page, per_page, query, sort_name) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, per_page, query, sort_name }),
    }
    return fetch(`${prefix}/paginatedList/`, requestOptions).then(handleResponse)
}
