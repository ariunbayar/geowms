export const service = {
    getAll,
    detail,
}

const prefix = '/back/api/user'

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // TODO auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                location.reload(true)
            }
            const error = (data && data.message) || response.statusText
            return Promise.reject(error)
        }

        return data
    })
}

function _getGetOptions() {
    return {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
    }
}

function getAll() {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch(`${prefix}/all/`, requestOptions).then(handleResponse)
}


function detail(id) {
    const opts = {
        ..._getGetOptions(),
    }

    return fetch(`${prefix}/${id}/дэлгэрэнгүй/`, opts).then(handleResponse)
}