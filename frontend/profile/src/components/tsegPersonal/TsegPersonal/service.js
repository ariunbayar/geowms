import {handleResponse, getPostOptions, getGetOptions} from '../../service'

const prefix = '/back/tuuhen_ov/tseg-personal'

export const service = {
    tsegPersonal,
    updateTseg,
    findSum,
    searchTsegName
}

function tsegPersonal(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }

    return fetch(`${prefix}/`, opts).then(handleResponse)
}

function updateTseg(id){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/update/`, opts).then(handleResponse)
}

function findSum(X, niitB) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({"x":niitB, "y":X})
    }
    return fetch(`/back/tuuhen_ov/tseg-personal/findSum/`, requestOptions).then(handleResponse)
}

function searchTsegName(name, query) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({name, query})
    }
    return fetch(`/back/tuuhen_ov/tseg-personal/searchName/`, requestOptions).then(handleResponse)
}