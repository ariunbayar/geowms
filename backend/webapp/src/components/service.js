import {handleResponse, getGetOptions} from '@/helpers/service'


export const service = {
    getGovOrgCount,
}

const prefix = '/back'

function getGovOrgCount() {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/govorg/тоо/`, opts).then(handleResponse)
}
