import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getall,
    getprop,
    editName,
    getFields,
    save,
    getDatas,
    remove,
    erese,
    getOverlapsFeature,
    setOverlapsFeature
}

const prefix = '/back/dedsan-butests'

function getall() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/all/`, opts).then(handleResponse)
}

function getprop(code) {
    const opts = {
        ...getPostOptions(),
    }
    return fetch(`${prefix}/prop/${code}/`, opts).then(handleResponse)
}

function editName(id, name){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ id, name }),
    }
    return fetch(`${prefix}/editName/`, opts).then(handleResponse)
}

function getFields(name, id, edit_name){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ name, id, edit_name }),
    }
    return fetch(`${prefix}/get-fields/`, opts).then(handleResponse)
}

function save(form_values, model_name, model_id, edit_name){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_values, model_name, model_id, edit_name}),
    }
    return fetch(`${prefix}/save/`, opts).then(handleResponse)
}

function getDatas(name){
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/getDatas/${name}/`, opts).then(handleResponse)
}

function remove(model_name, model_id){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ model_name, model_id }),
    }
    return fetch(`${prefix}/remove/`, opts).then(handleResponse)
}

function erese(model_name, model_id, top_id){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ model_name, model_id, top_id }),
    }
    return fetch(`${prefix}/erese/`, opts).then(handleResponse)
}

function getOverlapsFeature(feature_id) {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/overlaps-feature-get/${feature_id}/`, opts).then(handleResponse)
}

function setOverlapsFeature(feature_id, overlap_feature_id, state){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ feature_id, overlap_feature_id, state }),
    }
    return fetch(`${prefix}/overlaps-feature-set/`, opts).then(handleResponse)
}
