import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getPropertyFields,
    setPropertyFields,
    makeView,
}

const prefix = '/back/dedsan-butests'

function getall() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, opts).then(handleResponse)
}

function getPropertyFields(fid) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/property-fields/${fid}/`, opts).then(handleResponse)
}

function setPropertyFields(fid, tid, id_list, view_id, values){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ fid, tid, id_list, view_id, values }),
    }
    return fetch(`${prefix}/property-fields/save/`, opts).then(handleResponse)
}

function makeView(fid, tid, view_id, values) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ fid, tid, view_id, values}),
    }
    return fetch(`${prefix}/make-view/`, opts).then(handleResponse)
}
