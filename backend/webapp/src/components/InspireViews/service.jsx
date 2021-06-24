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

function getPropertyFields(tid, fid) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/property-fields/${tid}/${fid}/`, opts).then(handleResponse)
}

function setPropertyFields(form_datas){
    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }
    return fetch(`${prefix}/property-fields/save/`, opts).then(handleResponse)
}

function makeView(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas
    }
    return fetch(`${prefix}/make-view/`, opts).then(handleResponse)
}
