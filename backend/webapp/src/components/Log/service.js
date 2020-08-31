import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    payList,
}

const prefix = '/back/payment'

function payList(page, perpage) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage}),
    }
    return fetch(`${prefix}/payment-list/`, opts).then(handleResponse)
}