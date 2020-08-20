import {handleResponse, getPostOptions, getGetOptions} from '../../../helpers/service'
         

const prefix = '/back/tuuhen_ov'

export const service = {
    create,
}

function create(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas}),
    }

    return fetch(`${prefix}/create/`, opts).then(handleResponse)
}
