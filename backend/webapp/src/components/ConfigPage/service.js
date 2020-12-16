import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'


const geoserver = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/geoserver/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/geoserver/save/', opts).then(handleResponse)
    },

}


const site = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/site/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/site/save/', opts).then(handleResponse)
    },

}


function getDisk() {
    const requestOptions = {...getGetOptions()}
    return fetch('/back/api/config/disk/', requestOptions).then(handleResponse)
}


function getPostgeVersion() {
    const requestOptions = {...getGetOptions()}
    return fetch('/back/api/config/postresqlVersion/', requestOptions).then(handleResponse)
}


function getGeoServerVersion() {
    const requestOptions = getGetOptions()
    return fetch('/back/api/config/geoserver-version/', requestOptions).then(handleResponse)
}

const system = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/system/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/system/save/', opts).then(handleResponse)
    },

}

export const service = {
    config: {
        geoserver: geoserver,
        site: site,
        system: system
    },
    getDisk,
    getPostgeVersion,
    getGeoServerVersion,
}

