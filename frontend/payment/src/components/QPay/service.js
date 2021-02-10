import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

export const service = {
    handleCreateQpay,
    check
}

function handleCreateQpay(purchase_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({purchase_id})
    }
    return fetch('/qpay/create/', requestOptions).then(handleResponse)
}


function check(purchase_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({purchase_id})
    }
    return fetch('/qpay/check/', requestOptions).then(handleResponse)
}
