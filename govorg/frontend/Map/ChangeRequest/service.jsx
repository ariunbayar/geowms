import {handleResponse, getGetOptions} from '../../Components/helpers/service'
export const service = {
    getAll,
}

function getAll() {
    console.log("hohohohohohohooh   ")
    const requestOptions = {...getGetOptions()}
    return fetch(`/gov/api/org-request/change-request/`, requestOptions).then(handleResponse)
}