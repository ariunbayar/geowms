import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'
         

const prefix = '/back/tuuhen_ov'

export const service = {
    all,
    create,
    update,
    about,
    hureeCount,
    remove,
    tsegPersonal,
    tsegUstsan,
    tsegPersonalList,
    tsegPersonalRemove,
    dursgaltGazarCreate,
    dursgaltGazarUpdate,
    dursgaltGazarAll,
    dursgaltGazarRemove,
    dursgaltGazarAbout,
    hureeCreate,
    hureeUpdate,
    hureeDelete,
    hureeAll,
    ayulAll,
    ayulCreate,
    ayulUpdate,
    ayulDelete,
    tsegUstsanAll,
    tseg_remove,
    tsegustsanEdit,
    updateTseg,
    searchTseg,
    tsegPersonalSuccess,
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

function update(form_datas, aimagname, sumname) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas, aimagname, sumname}),
    }
    return fetch(`${prefix}/update/`, opts).then(handleResponse)
}

function hureeCount(id, action, tuuh_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, action, tuuh_id}),
    }
    return fetch(`${prefix}/huree-count/`, opts).then(handleResponse)
}

function create(form_datas, aimagname, sumname) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas, aimagname, sumname}),
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

function dursgaltGazarCreate(form_datas_values, form_datas) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas_values, form_datas}),
    }

    return fetch(`${prefix}/dursgalt-gazar/create/`, opts).then(handleResponse)
}

function dursgaltGazarUpdate(form_datas_values, form_datas) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({form_datas_values, form_datas}),
    }

    return fetch(`${prefix}/dursgalt-gazar/update/`, opts).then(handleResponse)
}

function dursgaltGazarAll(id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
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


function hureeCreate(dursgalt_id, x, y, tuuh_soyl_huree_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({dursgalt_id, x, y, tuuh_soyl_huree_id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/huree-create/`, opts).then(handleResponse)
}

function hureeUpdate(tuuhen_ov,  x, y, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tuuhen_ov,  x, y, id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/huree-update/`, opts).then(handleResponse)
}

function hureeDelete(ayul_id, tuuhen_ov) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ayul_id, tuuhen_ov}),
    }
    return fetch(`${prefix}/dursgalt-gazar/huree-delete/`, opts).then(handleResponse)
}

function hureeAll(id, tuuh_soyl_huree_id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id, tuuh_soyl_huree_id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/huree-all/`, opts).then(handleResponse)
}




function ayulCreate(dursgalt_id, x, y, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({dursgalt_id, x, y, id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/ayul-create/`, opts).then(handleResponse)
}

function ayulUpdate(tuuhen_ov, x, y, id) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({tuuhen_ov, x, y, id}),
    }
    return fetch(`${prefix}/dursgalt-gazar/ayul-update/`, opts).then(handleResponse)
}

function ayulDelete(ayul_id, tuuhen_ov) {
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({ayul_id, tuuhen_ov}),
    }
    return fetch(`${prefix}/dursgalt-gazar/ayul-delete/`, opts).then(handleResponse)
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

function tsegPersonalSuccess(point_type, objectid, point_class){
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({point_type, objectid, point_class}),
    }
    return fetch(`${prefix}/tseg-personal/batalgaajuulah/`, opts).then(handleResponse)
}