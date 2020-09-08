import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'
export const service = {
    loadWMSLayers,
    loadBaseLayers,
    findSum
}

function loadWMSLayers(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`/дэд-сан/${id}/давхаргууд/`, requestOptions).then(handleResponse)
}

function loadBaseLayers() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch('/суурь-давхарга/', requestOptions).then(handleResponse)
}

function findSum(coordinate) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({"x":coordinate[0], "y":coordinate[1]})
    }
    return fetch(`/back/tuuhen_ov/tseg-personal/findSum/`, requestOptions).then(handleResponse)
}