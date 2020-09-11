import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

export const service = {
    handleCreateQpay,
    check
}

function handleCreateQpay(price, purchase_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({price, purchase_id})
    }
    return fetch('/back/qpay/create/', requestOptions).then(handleResponse)
}


function check(purchase_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({purchase_id})
    }
    return fetch('/back/qpay/check/', requestOptions).then(handleResponse)
}