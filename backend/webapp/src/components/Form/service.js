import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'
         

const prefix = '/back/tuuhen_ov'

export const service = {
    create,
    tsegPersonal
}

function create(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas}),
    }

    return fetch(`${prefix}/create/`, opts).then(handleResponse)
}

function tsegPersonal(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas}),
    }

    return fetch(`${prefix}/tseg-personal/`, opts).then(handleResponse)
}
