import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    getFormFields,
}

const prefix = '/gov/api/tseg'

function getFormFields() {
    const requestOptions = {
        ...getGetOptions()
    }
    return fetch(`${prefix}/get-fields/`, requestOptions).then(handleResponse)
}

