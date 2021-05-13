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

    tableSave: function(id, tableId, field_names, table_name, feature_code) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({tableId, field_names, table_name, feature_code}),
        }
        return fetch(`${prefix}/mongo/tables/${id}/save/`, opts).then(handleResponse)
    },

    tableRemove: function(root_id, id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mongo/tables/remove/${root_id}/${id}/`, opts).then(handleResponse)
    },

    tableConfig: function(root_id, id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/mongo/tables/detail/${root_id}/${id}/`, opts).then(handleResponse)
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


const pg_config = {

    get: function(pk) {
        const requestOptions = getGetOptions()
        return fetch(`${prefix}/pg/get/${pk}/`, requestOptions).then(handleResponse)
    },

    save: function(values, out_type) {
        console.log(values, out_type)
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({values, out_type}),
        }
        return fetch(`${prefix}/pg/db-config-save/`, opts).then(handleResponse)
    },

    getInspireTree: function(connection_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/pg/${connection_id}/get-all-view-names/`, opts).then(handleResponse)
    },

    getProperties: function(feature_id) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({feature_id}),
        }
        return fetch(`${prefix}/pg/get-fields/`, opts).then(handleResponse)
    },

    tableSave: function(id, table_id, id_list, feature_name, table_name) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({ id, table_id, id_list, feature_name, table_name }),
        }
        return fetch(`${prefix}/pg/save-table/`, opts).then(handleResponse)
    },

    tableDetail: function(id, table_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/pg/${id}/${table_id}/table-detail/`, opts).then(handleResponse)
    },

    refreshTableData: function(id, table_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/pg/${id}/refresh-table-data/`, opts).then(handleResponse)
    },

    removeTable: function(id, table_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/pg/${id}/${table_id}/remove-table/`, opts).then(handleResponse)
    },

    refreshOneTable: function(id, table_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/pg/${id}/${table_id}/refresh-one-table/`, opts).then(handleResponse)
    },
}


export const service = {
    mssql_config,
    mongo_config,
    pg_config,
    remove,
    update,
    cronTabSave,
    cronTabDetail
}

function update(pk) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/update/${pk}/`, requestOptions).then(handleResponse)
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


