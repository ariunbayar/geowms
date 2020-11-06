import {handleResponse, getGetOptions} from '../helpers/service'



export const service = {
    userCount,
    govCount
}

const prefix = '/back'

function userCount() {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/api/user/userCount/`, opts).then(handleResponse)
}

function govCount() {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/api/org/org-count/`, opts).then(handleResponse)
}