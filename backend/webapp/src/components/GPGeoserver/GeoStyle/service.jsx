import {getGetOptions,handleResponse,getPostOptions} from '../../../helpers/service'
export const service ={
    checkStyleName,
    getStyleData
}

const prefix = '/back/dedsan-butests'

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