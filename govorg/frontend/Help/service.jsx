import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'

export const service = {
    setConfig,
}

const prefix = '/gov'

function setConfig(values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/set-config/`, requestOptions).then(handleResponse)
}

