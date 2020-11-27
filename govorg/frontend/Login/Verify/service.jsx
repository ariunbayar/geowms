import {handleResponse, getPostOptions} from '../../components/helpers/service'

export const service = {
    Verify
}

function Verify(new_password, re_new_password) {
    const requestOptions = {
        ...getPostOptions(),
          body: JSON.stringify({ new_password, re_new_password }),
    }    
    return fetch(`/profile/api/update-password/`, requestOptions).then(handleResponse)
}
