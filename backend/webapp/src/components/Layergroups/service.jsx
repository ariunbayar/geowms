import {getGetOptions,handleResponse,getPostOptions} from '../../helpers/service'
export const service ={
    getgrouplist,
    remove_layer_group,
    getGroupDetial,
    getLayers,
    createLayerGroup,
    getGroupCacheList,
    createGroupCache
}

const prefix = '/back'

function getgrouplist() {
    const opts = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/geoserver/rest/group_list/`, opts).then(handleResponse)
}


function getGroupCacheList(group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ group_name }),
    }
    return fetch(`${prefix}/geoserver/rest/get_group_cache_list/`, opts).then(handleResponse)
}

function remove_layer_group(group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ group_name }),
    }
    return fetch(`${prefix}/geoserver/rest/remove_layer_group/`, opts).then(handleResponse)
}

function createGroupCache(values, group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/geoserver/rest/create_group_cache/${group_name}/`, opts).then(handleResponse)
}

function getGroupDetial(group_name) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ group_name }),
    }
    return fetch(`${prefix}/geoserver/rest/get_group_detial/`, opts).then(handleResponse)
}

function getLayers() {
    const opts = {
        ...getGetOptions()
    }
    return fetch(`${prefix}/geoserver/rest/get_layers/`, opts).then(handleResponse)
}

function createLayerGroup(values, layer_list, group_state) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ values, layer_list, group_state}),
    }
    return fetch(`${prefix}/geoserver/rest/create_layer_group/`, opts).then(handleResponse)
}
