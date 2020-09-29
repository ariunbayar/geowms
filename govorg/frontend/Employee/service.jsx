import {handleResponse, getPostOptions, getGetOptions} from '../Components/helpers/service'

export const service = {
    paginatedList,
}

function paginatedList(page, per_page) {
    const requestOptions = {
        ...getPostOptions(),
          body: JSON.stringify({ page, per_page }),
    }

    return fetch(`/gov/api/employee/`, requestOptions).then(handleResponse)
}