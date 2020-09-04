import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'
         

const prefix = '/back/tuuhen_ov'

export const service = {
    all,
    create,
    update,
    about,
    remove,
    tsegPersonal,
    tsegUstsan,
    tsegPersonalList,
    tsegPersonalRemove,
    dursgaltGazarCreate,
    dursgaltGazarAll,
    dursgaltGazarRemove,
    dursgaltGazarAbout,
    hureeCreate,
    hureeAll,
    ayulAll,
    ayulCreate,
    tsegUstsanAll,
    tseg_remove,
    tsegustsanEdit,
    updateTseg,
    searchTseg,
    checkDan,
}
function all() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/`, requestOptions).then(handleResponse)
}

function about(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/about/`, opts).then(handleResponse)
}

function update(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas}),
    }
    return fetch(`${prefix}/update/`, opts).then(handleResponse)
}

function create(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas}),
    }
    return fetch(`${prefix}/create/`, opts).then(handleResponse)
}

function remove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/remove/`, opts).then(handleResponse)
}


function tsegPersonalList(page, perpage, query){

    const requestOptions = {
        ...getPostOptions(),
        body: JSON.stringify({ page, perpage, query }),
    }

    return fetch(`${prefix}/tseg-personal/list/`, requestOptions).then(handleResponse)
}


function tsegPersonalRemove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/tseg-personal/remove/`, opts).then(handleResponse)
}


function tsegPersonal(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }

    return fetch(`${prefix}/tseg-personal/`, opts).then(handleResponse)
}

function tsegUstsan(form_datas) {

    const opts = {
        ...getPostOptions(),
        body: form_datas,
    }
    return fetch(`${prefix}/tseg-ustsan/`, opts).then(handleResponse)
}


function dursgaltGazarCreate(form_datas) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas}),
    }

    return fetch(`${prefix}/dursgalt-gazar/create/`, opts).then(handleResponse)
}

function dursgaltGazarAll() {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({}),
    }
    return fetch(`${prefix}/dursgalt-gazar/all/`, opts).then(handleResponse)
}

function dursgaltGazarRemove(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch(`${prefix}/dursgalt-gazar/remove/`, opts).then(handleResponse)
}


function dursgaltGazarAbout(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/about/`, opts).then(handleResponse)
}


function hureeCreate(id, hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt}),
    }
    return fetch(`${prefix}/dursgalt-gazar/huree-create/`, opts).then(handleResponse)
}

function hureeAll(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/huree-all/`, opts).then(handleResponse)
}

function ayulCreate(id, ayul_utm, ayul_x, ayul_y, ayul_llx, ayul_lly, ayul_llalt) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, ayul_utm, ayul_x, ayul_y, ayul_llx, ayul_lly, ayul_llalt}),
    }
    return fetch(`${prefix}/dursgalt-gazar/ayul-create/`, opts).then(handleResponse)
}

function ayulAll(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/ayul-all/`, opts).then(handleResponse)
}


function tsegUstsanAll(id) {
    const opts = {
        ...getGetOptions(id),
    }
    return fetch(`${prefix}/tseg-ustsan_all/`, opts).then(handleResponse)
}

function tseg_remove(id) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify({id}),
        }
        return fetch(`${prefix}/tseg-ustsan_remove/`, opts).then(handleResponse)    
}


function tsegustsanEdit(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan_edit/`, opts).then(handleResponse)
}

function updateTseg(id){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-personal/update/`, opts).then(handleResponse)
}

function searchTseg(query){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({query}),
    }
    return fetch(`${prefix}/tseg-personal/search/`, opts).then(handleResponse)
}

function checkDan(){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({}),
    }
    return fetch(`${prefix}/check-dan/`, opts).then(handleResponse)
}