import {getPostOptions, handleResponse} from '../../../helpers/service'

export const service = {
    passwordChange,
}

function passwordChange(payload) {
    const requestOptions = {
        ...getPostOptions(),
    body: JSON.stringify( payload ),
    }

    return fetch(`/profile/api/update-password/`, requestOptions).then(handleResponse)
}
