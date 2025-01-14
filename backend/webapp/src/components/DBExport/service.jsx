import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'

const prefix = '/back/another-database'



const pg_config = {

    get: function(pk) {
        const requestOptions = getGetOptions()
        return fetch(`${prefix}/pg/get/${pk}/`, requestOptions).then(handleResponse)
    },

    save: function(values, out_type) {
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
        return fetch(`${prefix}/pg/get-all-view-names/`, opts).then(handleResponse)
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

    removeTable: function(id, table_id, is_insert) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({ is_insert }),
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

function remove(pk, state) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({state}),
    }
    return fetch(`${prefix}/remove/${pk}/`, requestOptions).then(handleResponse)
}

export const service = {
    pg_config,
    remove,
    cronTabSave,
    cronTabDetail,
    DBConfiSave
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


