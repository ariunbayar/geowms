import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

const prefix = '/back/another-database'



const pg_config = {

    get: function(pk) {
        const requestOptions = getGetOptions()
        return fetch(`${prefix}/mssql/get/${pk}/`, requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch(`${prefix}/pg/db-config-save/`, opts).then(handleResponse)
    },

    getTableNames: function(connection_id, table_id ) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({ connection_id, table_id }),
        }
        return fetch(`${prefix}/mssql/get-all-table-names/`, opts).then(handleResponse)
    },

    getAttributes(table_name, id) {
        const requestOptions = {
            ...getPostOptions(),
            body: JSON.stringify({ table_name, id }),
        }
        return fetch(`${prefix}/mssql/get-attributes/`, requestOptions).then(handleResponse)
    },

    saveToDbTable(table_name, field_config, another_database_id, feature_code, table_id) {
        const requestOptions = {
            ...getPostOptions(),
            body: JSON.stringify({ table_name, field_config, another_database_id, feature_code, table_id }),
        }
        return fetch(`${prefix}/mssql/save-to-ano-db-table/`, requestOptions).then(handleResponse)
    },

    insertToInspire(table_name, field_config, another_database_id, feature_code) {
        const requestOptions = {
            ...getPostOptions(),
            body: JSON.stringify({ table_name, field_config, another_database_id, feature_code }),
        }
        return fetch(`${prefix}/mssql/insert-to-inspire/`, requestOptions).then(handleResponse)
    },

    tableRemove: function(root_id, id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mongo/tables/remove/${root_id}/${id}/`, opts).then(handleResponse)
    },

    getProperties(feature_code) {
        const requestOptions = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mssql/get-properties/${feature_code}/`, requestOptions).then(handleResponse)
    },

    getThemeFeatures() {
        const requestOptions = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/get-inspire-shatlal/`, requestOptions).then(handleResponse)
    },

    refreshData(connection_id) {
        const requestOptions = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mssql/refresh-mssql-datas/${connection_id}/`, requestOptions).then(handleResponse)
    }
}

function remove(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/remove/${pk}/`, requestOptions).then(handleResponse)
}

export const service = {
    pg_config,
    remove,
    update,
    cronTabSave,
    cronTabDetail,
    DBConfiSave
}

function update(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/update/${pk}/`, requestOptions).then(handleResponse)
}

function DBConfiSave(values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }
    return fetch(`${prefix}/db-config-save/`, requestOptions).then(handleResponse)
}

function cronTabSave(values) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify(values),
    }
    return fetch(`${prefix}/crontab-save/`, requestOptions).then(handleResponse)
}

function cronTabDetail(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/detail/${pk}/`, requestOptions).then(handleResponse)
}


