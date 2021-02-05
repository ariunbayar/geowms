import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getPropertyFields,
    setPropertyFields,
    getStyleData,
    checkStyleName
}

const prefix = '/back/dedsan-butests'

function getall() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, opts).then(handleResponse)
}

function checkStyleName(style_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ style_name }),
    }
    return fetch(`${prefix}/check-style-name/`, opts).then(handleResponse)
}

function getPropertyFields(fid) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/property-fields/${fid}/`, opts).then(handleResponse)
}


function setPropertyFields(fid, fields, tid, values){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ fid, fields, tid, values}),
    }
    return fetch(`${prefix}/property-fields/save/`, opts).then(handleResponse)
}

function getStyleData(geom_type) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ geom_type }),
    }
    return fetch(`${prefix}/style-data/`, opts).then(handleResponse)
}
