import {handleResponse, getPostOptions, getGetOptions} from '../components/helpers/service'
export const service = {
    getDetail,
    metaDelete,
    setEdit,
    getMetaFields,
    getAll,
}

const prefix = '/gov/api/meta-data'

function getAll() {
    const requestOptions = {
        ...getGetOptions()
    }
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function getDetail(id, is_show_choice) {
    const requestOptions = {
        ...getGetOptions()
    }
    return fetch(`${prefix}/${id}/${is_show_choice}/detail/`, requestOptions).then(handleResponse)
}

function metaDelete(id) {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/${id}/delete/`, requestOptions).then(handleResponse)
}

function setEdit(id, meta_data, geom_ids) {
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({meta_data, geom_ids})
    }
    return fetch(`${prefix}/${id}/edit/`, requestOptions).then(handleResponse)
}

function getMetaFields() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/get-fields/`, requestOptions).then(handleResponse)
}