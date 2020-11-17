import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'


const prefix = '/back/api/config'


const geoserver = {

    get: function() {
        const requestOptions = {...getGetOptions()}
        return fetch(`${prefix}/geoserver/`, requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch(`${prefix}/geoserver/save/`, opts).then(handleResponse)
    },

}


function getDisk() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/disk/`, requestOptions).then(handleResponse)
}


function getPostgeVersion() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/postresqlVersion/`, requestOptions).then(handleResponse)
}


export const service = {
    config: {
        geoserver: geoserver,
    },
    getDisk,
    getPostgeVersion
}


