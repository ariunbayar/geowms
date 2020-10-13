export const service = {
    getAll,
    create,
    update,
    remove,
    move,
    roleCreate,
    roleRemove,
    defaultCheckUpdate,
    detail,
    ModuleCheck,
    table_list_All,
    updateGis,
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
    return fetch(`${prefix}/bundle/all/`, requestOptions).then(handleResponse)
}

function create(values) {

    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/create/`, opts).then(handleResponse)
}


function detail(id) {
    const requestOptions = {..._getGetOptions()}

    return fetch(`${prefix}/bundle/${id}/updatemore/`, requestOptions).then(handleResponse)
}


function update(values) {

    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/update/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/bundle/remove/`, opts).then(handleResponse)
}


function move(id, move) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify({id, move}),
    }

    return fetch(`${prefix}/bundle/move/`, opts).then(handleResponse)
}

function roleCreate(values) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/roleCreate/`, opts).then(handleResponse)
}

function roleRemove(values) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/roleRemove/`, opts).then(handleResponse)
}

function defaultCheckUpdate(values) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/defaultCheckUpdate/`, opts).then(handleResponse)
}

function ModuleCheck(values){
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/ModuleCheck/`, opts).then(handleResponse)
}

function table_list_All() {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch(`${prefix}/gis/table_list/`, requestOptions).then(handleResponse)
}

function updateGis(values){
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch(`${prefix}/bundle/updateGis/`, opts).then(handleResponse)
}
