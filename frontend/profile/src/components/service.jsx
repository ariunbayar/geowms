import { handleResponse, getGetOptions, getPostOptions } from "@helpUtils/handleRequest"

export const service = {
    paginatedList,
    downloadPurchase,
}

function paginatedList(page, per_page) {
    const requestOptions = {
        ...getPostOptions(),
    body: JSON.stringify({ page, per_page }),
    }

    return fetch(`/profile/api/all/`, requestOptions).then(handleResponse)
}

function downloadPurchase(payment_id) {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`/payment/api/download-purchase/${payment_id}/`, requestOptions).then(handleResponse)
}
