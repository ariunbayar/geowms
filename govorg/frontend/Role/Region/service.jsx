import {handleResponse,getGetOptions, getPostOptions, getCookie} from '../../components/helpers/service'
export const service = {
    getRegion,
}

function getRegion() {
    const opts = getGetOptions()
    return fetch('/gov/api/role/region/', opts).then(handleResponse)
}
