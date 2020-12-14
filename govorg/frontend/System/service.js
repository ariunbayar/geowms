import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'

export const service = {
    paginatedList,
    detail,
    getToken
};

function paginatedList(page, per_page, query) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, per_page, query }),
    };

    return fetch(`/gov/api/system/`, requestOptions).then(handleResponse);
}

function detail(id) {
    const opts = {
        ...getGetOptions(),
    }

    return fetch(`/gov/api/system/${id}/detail/`, opts).then(handleResponse)
}

function getToken() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`/gov/api/system/user-token/`, opts).then(handleResponse)
}
