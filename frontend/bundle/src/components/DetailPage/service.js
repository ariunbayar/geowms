import { handleResponse, getGetOptions, getPostOptions } from "@helpUtils/handleRequest"

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
    getUser,
    checkButtonEnableWithPdf,
    getPopUpInfo,
    checkButtonEnableWithId,
    getFeatureInfo,
    getGeom,
    getContainGeoms,
    getFindValues,
    getBuffer,
}

function loadWMSLayers(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/дэд-сан/${id}/давхаргууд/`, requestOptions).then(handleResponse)
}

function loadBaseLayers() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/суурь-давхарга/', requestOptions).then(handleResponse)
}

function getUser() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/get_user/', requestOptions).then(handleResponse)
}

function payment(price, description, data_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({price, description, data_id})
    }
    return fetch('/back/payment/purchase/', requestOptions).then(handleResponse)
}

function paymentDraw(values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify(values)
    }
    return fetch('/payment/purchase-draw/', requestOptions).then(handleResponse)
}

function paymentCalcPrice(area, layer_list, feature_info_list, selected_type) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ area, layer_list, feature_info_list, selected_type })
    }
    return fetch('/payment/calc-price/', requestOptions).then(handleResponse)
}

function purchaseFromCart(datas) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ datas })
    }
    return fetch('/payment/purchase-from-cart/', requestOptions).then(handleResponse)
}

function searchPoint(point_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ point_id })
    }
    return fetch('/api/find-point/', requestOptions).then(handleResponse)
}

function getAimags() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/api/aimag/', requestOptions).then(handleResponse)
}

function getSum(aimag_name) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({aimag_name})
    }
    return fetch('/api/sum/', requestOptions).then(handleResponse)
}

function checkButtonEnableWithPdf(geo_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ geo_id })
    }
    return fetch('/payment/check-enable-pdf/', requestOptions).then(handleResponse)
}

function checkButtonEnableWithId(geo_id, pdf_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ geo_id, pdf_id })
    }
    return fetch('/payment/check-enable-pdf-id/', requestOptions).then(handleResponse)
}

function getPopUpInfo(layers_code, coordinate, scale_value) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ layers_code, coordinate, scale_value })
    }
    return fetch('/payment/get-popup-info/', requestOptions).then(handleResponse)
}

function getFeatureInfo(layer_codes, coordinates) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({layer_codes, coordinates})
    }
    return fetch('/payment/get-feature-info/', requestOptions).then(handleResponse)
}

function getGeom(geo_id, bundle_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ geo_id, bundle_id })
    }
    return fetch('/api/get-geom/', requestOptions).then(handleResponse)
}

function getContainGeoms(layers_code, geometry, km_scale) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({layers_code, geometry, km_scale})
    }
    return fetch('/payment/get-contain-geoms/', requestOptions).then(handleResponse)
}

function getFindValues(bundle_id, value) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ bundle_id, value })
    }
    return fetch('/api/search/', requestOptions).then(handleResponse)
}

function getBuffer(center, scale) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ center, scale })
    }
    return fetch('/api/get-buffer/', requestOptions).then(handleResponse)
}
