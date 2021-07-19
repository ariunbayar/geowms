import {getGetOptions, getPostOptions, handleResponse} from '../helpers/service'

export const service = {
    payment,
    purchaseAll,
    downloadPurchase,
    getDetails,
    paginatedList,
    userEmailCheck,
    setEmail
}


function payment(purchase_all){
    const requestOptions = {...getPostOptions(),
        body: JSON.stringify({purchase_all})}
    return fetch(`/payment/dictionaryRequest/`, requestOptions).then(handleResponse)
}

function purchaseAll(purchase_id){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({purchase_id})
    }
    return fetch('/back/payment/purchase-all/', requestOptions).then(handleResponse)
}

function downloadPurchase(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/payment/api/download-purchase/${id}/`, requestOptions).then(handleResponse)
}

function getDetails(id){
    const requestOptions = {...getGetOptions()}
    return fetch(`/api/${id}/get-details/`, requestOptions).then(handleResponse)
}

function paginatedList(page, per_page) {
    const requestOptions = {
        ...getPostOptions(),
    body: JSON.stringify({ page, per_page }),
    }
    return fetch(`/api/all/`, requestOptions).then(handleResponse)
}

function userEmailCheck(id){
    const requestOptions = {...getGetOptions()}
    return fetch(`/api/check-email/`, requestOptions).then(handleResponse)
}

function setEmail(email) {
    const requestOptions = {
        ...getPostOptions(),
    body: JSON.stringify({ email }),
    }
    return fetch(`/api/set-email/`, requestOptions).then(handleResponse)
}
