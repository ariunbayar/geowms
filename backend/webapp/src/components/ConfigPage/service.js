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

const email = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/email/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/email/save/', opts).then(handleResponse)
    },

}

const qgis = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/qgis/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/qgis/save/', opts).then(handleResponse)
    },

}

const dan = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/dan/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/dan/save/', opts).then(handleResponse)
    },

}

const payment = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/payment/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/payment/save/', opts).then(handleResponse)
    },

}

const qpay = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/qpay/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/qpay/save/', opts).then(handleResponse)
    },

}

const inspire = {
    get_value_type_fields: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/get-value-type-fields/', requestOptions).then(handleResponse)
    },
    save_value_types: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({ values }),
        }
        return fetch('/back/api/config/save-value-types/', opts).then(handleResponse)
    }

}

const qgis_plugin = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/qgis-plugin/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: values
        }
        return fetch('/back/api/config/qgis-plugin/save/', opts).then(handleResponse)
    },

}


export const service = {
    config: {
        geoserver: geoserver,
        site: site,
        system: system,
        email: email,
        qgis: qgis,
        dan: dan,
        payment: payment,
        qpay: qpay,
        inspire: inspire,
        qgis_plugin: qgis_plugin,
    },
    getDisk,
    getPostgeVersion,
    getGeoServerVersion,
}
