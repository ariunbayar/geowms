
import {handleResponse, getPostOptions, getGetOptions} from '../../components/helpers/service'

export const service = {
    getPerms,
}

const prefix = '/gov/api/role/org'

function getPerms() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}
