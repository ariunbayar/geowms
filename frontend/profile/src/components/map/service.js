import {handleResponse, getPostOptions, getGetOptions} from '../helpers/service'
export const service = {
    loadBaseLayers,
    findSum
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
