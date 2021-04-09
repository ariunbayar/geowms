import {getGetOptions,handleResponse,getPostOptions} from '../../../helpers/service'
export const service ={
    checkStyleName,
    getStyleData,
    createStyle,
    convertSldToJson
}

const prefix = '/back/geoserver/rest'

function convertSldToJson(file_content) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ file_content }),
    }
    return fetch(`${prefix}/conver-sld-json/`, opts).then(handleResponse)
}

function checkStyleName(style_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_name }),
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

function createStyle(style_datas, style_name, style_title, style_abstract) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_datas, style_name, style_title, style_abstract}),
    }
    return fetch(`${prefix}/create-style/`, opts).then(handleResponse)
}