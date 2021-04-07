import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

const mssql_prefix = '/api/mssql'

function getAttributes(table_name) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ table_name }),
    }
    return fetch(`${mssql_prefix}/get-attributes/`, requestOptions).then(handleResponse)
}

function insertToInspire(table_name, columns) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ table_name, columns }),
    }
    return fetch(`${mssql_prefix}/insert-to-inspire/`, requestOptions).then(handleResponse)
}

function getProperties() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${mssql_prefix}/get-properties/`, requestOptions).then(handleResponse)
}

const mssql_config = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch(`${mssql_prefix}/connection/get/`, requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch(`${mssql_prefix}/connection/save/`, opts).then(handleResponse)
    },
}

export const service = {
    getAttributes,
    insertToInspire,
    mssql_config,
    getProperties,
}