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


function getAll() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/all/`, requestOptions).then(handleResponse)
}


function getDisk() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/disk/`, requestOptions).then(handleResponse)
}


function getDetail(id) {
    const opts = {...getGetOptions()}
    return fetch(`${prefix}/${id}/detail/`, opts).then(handleResponse)
}


function update(id, values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }
    return fetch(`${prefix}/${id}/update/`, opts).then(handleResponse)
}


function create(values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }
    return fetch(`${prefix}/create/`, opts).then(handleResponse)
}


function remove(id) {
    const opts = {...getPostOptions()}
    return fetch(`${prefix}/${id}/delete/`, opts).then(handleResponse)
}


function getPostgeVersion() {
    const requestOptions = {...getGetOptions()}
    return fetch(`${prefix}/postresqlVersion/`, requestOptions).then(handleResponse)
}


export const service = {
    config: {
        geoserver: geoserver,
    },
    getAll,
    getDisk,
    getDetail,
    update,
    create,
    remove,
    getPostgeVersion
}


