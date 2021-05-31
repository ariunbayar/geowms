import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    requestReject,
    requestApprove,
    requestDismiss,
    llcList,
    handleRequestData,
    pg_config,
    getFilesDetal
}

const prefix = '/gov/api/llc-request'

function getFilesDetal(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`/llc/backend/${id}/get-file-shapes/`, opts).then(handleResponse)
}

function requestReject(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ ids, feature_id }),
    }
    return fetch(`${prefix}/reject/`, requestOptions).then(handleResponse)
}

function requestApprove(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ids, feature_id}),
    }
    return fetch(`${prefix}/approve/`, requestOptions).then(handleResponse)
}

function requestDismiss(ids, feature_id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ids, feature_id}),
    }
    return fetch(`${prefix}/dismiss/`, requestOptions).then(handleResponse)
}

function llcList(id) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ id }),
    }
    return fetch(`${prefix}`, requestOptions).then(handleResponse)
}

function handleRequestData(id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/get-request-data/`, opts).then(handleResponse)
}

const pg_config = {
    getInspireTree: function(connection_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/${connection_id}/get-all-view-names/`, opts).then(handleResponse)
    },

    tableDetail: function(id, table_id) {
        const opts = {
            ...getGetOptions(),
        }
        return fetch(`${prefix}/${id}/${table_id}/table-detail/`, opts).then(handleResponse)
    },

    getProperties: function(feature_id) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({feature_id}),
        }
        return fetch(`${prefix}/get-fields/`, opts).then(handleResponse)
    },
}
