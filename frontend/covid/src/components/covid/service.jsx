import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

export const service = {
    covidConfigGet,
}

function covidConfigGet() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/back/api/config/covid/', requestOptions).then(handleResponse)
}
