import {getGetOptions, handleResponse, getPostOptions} from '../../helpers/service'
export const service ={
    layers,
}

const prefix = '/back/geoserver/rest'

function layers() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/layers/`, opts).then(handleResponse)
}

function editName(id, name){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ id, name }),
    }
    return fetch(`${prefix}/editName/`, opts).then(handleResponse)
}