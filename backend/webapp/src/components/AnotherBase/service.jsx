import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

const prefix = '/back/another-database'



const mssql_config = {

    get: function(pk) {
        const requestOptions = getGetOptions()
        return fetch(`${prefix}/mssql/get/${pk}/`, requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch(`${prefix}/mssql/save/`, opts).then(handleResponse)
    },
    getTableNames: function(connection_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/get-all-table-names/${connection_id}/`, opts).then(handleResponse)
    },
    getAttributes(table_name, id) {
        const requestOptions = {
            ...getPostOptions(),
            body: JSON.stringify({ table_name, id }),
        }
        return fetch(`${prefix}/get-attributes/`, requestOptions).then(handleResponse)
    },
    insertToInspire(table_name, columns, connection_id) {
        const requestOptions = {
            ...getPostOptions(),
            body: JSON.stringify({ table_name, columns, connection_id }),
        }
        return fetch(`${prefix}/insert-to-inspire/`, requestOptions).then(handleResponse)
    },
    getProperties() {
        const requestOptions = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/get-properties/`, requestOptions).then(handleResponse)
    },
    getThemeFeatures() {
        const requestOptions = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/get-inspire-shatlal/`, requestOptions).then(handleResponse)
    },
}

const mongo_config = {

    get: function(pk) {
        const requestOptions = getGetOptions()
        return fetch(`${prefix}/mongo/get/${pk}/`, requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch(`${prefix}/mongo/save/`, opts).then(handleResponse)
    },

    tables: function(id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mongo/tables/${id}/`, opts).then(handleResponse)
    },

    fieldNames: function(id, name) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mongo/fields/${id}/${name}/`, opts).then(handleResponse)
    },
}

function remove(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/remove/${pk}/`, requestOptions).then(handleResponse)
}

export const service = {
    mssql_config,
    mongo_config,
    remove
}