import {handleResponse,getGetOptions, getPostOptions, getCookie} from '../../components/helpers/service'
export const service = {
    getBaseLayers,
}

function getBaseLayers() {
    const opts = getGetOptions()
    return fetch('/gov/api/role/region/', opts).then(handleResponse)
}