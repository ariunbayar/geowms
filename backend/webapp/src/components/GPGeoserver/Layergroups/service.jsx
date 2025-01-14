import {getGetOptions,handleResponse,getPostOptions} from '../../../helpers/service'
export const service ={
    getgrouplist,
    remove_layer_group,
    getGroupDetial,
    getLayers,
    createLayerGroup,
    getGroupCacheList,
    createGroupCache,
    getStyleList,
    getWslist,
}

const prefix = '/back/geoserver/rest'

function getWslist() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/ws-list/`, opts).then(handleResponse)
}

function getStyleList() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/style-list/`, opts).then(handleResponse)
}

function getgrouplist() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/group_list/`, opts).then(handleResponse)
}


function getGroupCacheList(group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ group_name }),
    }
    return fetch(`${prefix}/get_group_cache_list/`, opts).then(handleResponse)
}

function remove_layer_group(group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ group_name }),
    }
    return fetch(`${prefix}/remove_layer_group/`, opts).then(handleResponse)
}

function createGroupCache(values, group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/create_group_cache/${group_name}/`, opts).then(handleResponse)
}

function getGroupDetial(group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ group_name }),
    }
    return fetch(`${prefix}/get_group_detial/`, opts).then(handleResponse)
}

function getLayers(ws_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ ws_name }),
    }
    return fetch(`${prefix}/get_layers/`, opts).then(handleResponse)
}

function createLayerGroup(values, group_layer_name, layer_list, group_state, old_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values, group_layer_name, layer_list, group_state, old_name}),
    }
    return fetch(`${prefix}/create_layer_group/`, opts).then(handleResponse)
}
