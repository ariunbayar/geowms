// import { handleResponse, getGetOptions, getPostOptions } from "@helpUtils/handleRequest" -- дууд

const NOT_REJECT_ERROR_CODES = [504]

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

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // TODO auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                location.reload(true)
            }

            const status_code = response.status
            const text = (data && data.message) || response.statusText

            if (!NOT_REJECT_ERROR_CODES.includes(status_code)) {
                const error_obj = {
                    'text': text,
                    'code': status_code
                }
                return Promise.reject(error_obj)
            }
        }

        return data
    })
}

export function getPostOptions() {
    return {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    }
}

export function getGetOptions() {
    return {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
    }
}
