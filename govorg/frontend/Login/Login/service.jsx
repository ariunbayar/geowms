import {handleResponse, getPostOptions} from '../../components/helpers/service'

export const service = {
    logIn
}

function logIn(email, password) {
    const requestOptions = {
        ...getPostOptions(),
          body: JSON.stringify({ email, password }),
    }    
    return fetch(`/profile/api/update-password/`, requestOptions).then(handleResponse)
}
