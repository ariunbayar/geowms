import {handleResponse, getPostOptions} from '../components/helpers/service'

export const service = {
    updatePassword
}

function updatePassword(new_password, old_password) {
    const requestOptions = {
        ...getPostOptions(),
          body: JSON.stringify({ new_password, old_password }),
    }
    return fetch(`/profile/api/update-password/`, requestOptions).then(handleResponse)
}
