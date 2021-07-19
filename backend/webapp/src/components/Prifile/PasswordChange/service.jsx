import {getPostOptions, handleResponse} from '../../../helpers/service'

export const service = {
    updatePassword,
}

function updatePassword(payload) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify( payload ),
    }
    return fetch(`/api/update-password/`, requestOptions).then(handleResponse)
}
