import {getGetOptions,handleResponse,getPostOptions} from '../../../helpers/service'
export const service ={
    checkStyleName,
    getStyleData,
    createStyle,
    convertSldToJson,
    getStyleList,
    removeStyle,
    getStyleDetail
}

const prefix = '/back/geoserver/rest'

function getStyleDetail(style_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_name }),
    }
    return fetch(`${prefix}/style-detail/`, opts).then(handleResponse)
}

function removeStyle(style_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_name }),
    }
    return fetch(`${prefix}/style-remove/`, opts).then(handleResponse)
}

function getStyleList() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/style-list/`, opts).then(handleResponse)
}

function convertSldToJson(file_content) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ file_content }),
    }
    return fetch(`${prefix}/conver-sld-json/`, opts).then(handleResponse)
}

function checkStyleName(style_name, style_update) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_name, style_update }),
    }
    return fetch(`${prefix}/check-style-name/`, opts).then(handleResponse)
}

function getStyleData(geom_type) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ geom_type }),
    }
    return fetch(`${prefix}/style-data/`, opts).then(handleResponse)
}

function createStyle(style_datas, style_name, style_title, style_abstract, style_update, old_style_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_datas, style_name, style_title, style_abstract, style_update, old_style_name}),
    }
    return fetch(`${prefix}/create-style/`, opts).then(handleResponse)
}
