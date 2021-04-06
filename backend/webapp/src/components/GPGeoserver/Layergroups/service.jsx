import {getGetOptions,handleResponse,getPostOptions} from '../../../helpers/service'
export const service ={
    getgrouplist,
    remove_layer_group,
    getGroupDetial,
    getLayers,
    createLayerGroup,
    getGroupCacheList,
    createGroupCache
}

const prefix = '/back/geoserver/rest'

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

function getLayers() {
    const opts = {
        ...getGetOptions()
    }
    return fetch(`${prefix}/get_layers/`, opts).then(handleResponse)
}

function createLayerGroup(values, layer_list, group_state, old_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values, layer_list, group_state, old_name}),
    }
    return fetch(`${prefix}/create_layer_group/`, opts).then(handleResponse)
}
