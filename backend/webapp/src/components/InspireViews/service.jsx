import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getPropertyFields,
    setPropertyFields,
}

const prefix = '/back/dedsan-butests'

function getall() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, opts).then(handleResponse)
}

function getPropertyFields(fid) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/property-fields/${fid}/`, opts).then(handleResponse)
}


function setPropertyFields(fid, fields, tid){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ fid, fields, tid }),
    }
    return fetch(`${prefix}/property-fields/save/`, opts).then(handleResponse)
}