import {getGetOptions, handleResponse, getPostOptions} from '../../helpers/service'

export const service ={
    paginatedList,
    createPerm
}

const prefix = '/back/api/org'


function paginatedList(page, perpage, query, sort_name){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query, sort_name }),
    }
    return fetch(`${prefix}/perm-get-list/`, requestOptions).then(handleResponse)
}


function createPerm(values){
    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ values }),
    }
    return fetch(`${prefix}/create-perm/`, requestOptions).then(handleResponse)
}