import {getGetOptions, getPostOptions, handleResponse} from '../helpers/service'

export const service = {
    payment,
    purchaseAll,
    downloadPurchase,
    getDetails,
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
    return fetch(`/profile/api/${id}/get-details/`, requestOptions).then(handleResponse)
}
