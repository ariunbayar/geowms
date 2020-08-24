import {handleResponse, getGetOptions} from '../helpers/service'



export const service = {
    userCount
}

const prefix = '/back'

function userCount() {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/api/user/userCount/`, opts).then(handleResponse)
}
