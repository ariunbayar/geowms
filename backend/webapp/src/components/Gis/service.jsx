import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'

export const service = {
    getAll,
    getDetail
}

function getAll() {
    const requestOptions = {
        ...getGetOptions()
    }
    return fetch(`/back/gis/table_list/`, requestOptions).then(handleResponse)
}

function getDetail(schemaname, tablename) {
    const requestOptions = {
        ...getGetOptions()
    }
    return fetch(`/back/gis/field_list/${schemaname}/${tablename}/`, requestOptions).then(handleResponse)
}