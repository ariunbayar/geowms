import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    payList,
}

const prefix = '/back/payment'

function payList(page, perpage, query, sort_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({page, perpage, query, sort_name}),
    }
    return fetch(`${prefix}/payment-list/`, opts).then(handleResponse)
}