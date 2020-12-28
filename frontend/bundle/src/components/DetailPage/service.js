import { setNestedObjectValues } from "formik";

export const service = {
    loadWMSLayers,
    loadBaseLayers,
    payment,
    paymentDraw,
    paymentCalcPrice,
    purchaseFromCart,
    searchPoint,
    getAimags,
    getSum,
    isUser,
    checkButtonEnable,
}

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

function loadWMSLayers(id) {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch(`/дэд-сан/${id}/давхаргууд/`, requestOptions).then(handleResponse)
}

function loadBaseLayers() {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch('/суурь-давхарга/', requestOptions).then(handleResponse)
}

function isUser() {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch('/is_user/', requestOptions).then(handleResponse)
}

function payment(price, description, data_id) {
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify({price, description, data_id})
    }
    return fetch('/back/payment/purchase/', requestOptions).then(handleResponse)
}

function paymentDraw(values) {
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify(values)
    }
    return fetch('/payment/purchase-draw/', requestOptions).then(handleResponse)
}

function paymentCalcPrice(area, layer_list, feature_info_list, selected_type) {
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify({ area, layer_list, feature_info_list, selected_type })
    }
    return fetch('/payment/calc-price/', requestOptions).then(handleResponse)
}

function purchaseFromCart(datas) {
    console.log(JSON.stringify({ datas }));
    console.log(JSON.stringify(datas));
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify({ datas })
    }
    return fetch('/payment/purchase-from-cart/', requestOptions).then(handleResponse)
}

function searchPoint(point_id) {
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify({point_id})
    }
    return fetch('/gov/api/tseg-personal/find-point/', requestOptions).then(handleResponse)
}

function getAimags() {
    const requestOptions = {
        ..._getGetOptions(),
    }
    return fetch('/api/aimag/', requestOptions).then(handleResponse)
}

function getSum(aimag_name) {
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify({aimag_name})
    }
    return fetch('/api/sum/', requestOptions).then(handleResponse)
}

function checkButtonEnable(pdf_id) {
    const requestOptions = {
        ..._getPostOptions(),
        body: JSON.stringify({pdf_id})
    }
    return fetch('/payment/check-enable/', requestOptions).then(handleResponse)
}