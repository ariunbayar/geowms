export const service = {
    getAll,
    create,
    update,
    remove,
    detail,
}

const prefix = '/back'

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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

function _getPostOptions() {
    return {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    }
}

function getAll() {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch(`${prefix}/govorg/`, requestOptions).then(handleResponse)
}

function create(values) {

    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/govorg/create/`, opts).then(handleResponse)
}


function update(values) {

    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/govorg/update/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/govorg/remove/`, opts).then(handleResponse)
}


function detail(values) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/govorg/detail/`, opts).then(handleResponse)
}
