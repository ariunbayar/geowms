import {getGetOptions, getPostOptions, handleResponse} from '../helpers/service'

export const service = {
    payment,
    purchaseAll,
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