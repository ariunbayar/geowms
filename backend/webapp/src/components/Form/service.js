import {handleResponse, getPostOptions, getGetOptions} from '../../helpers/service'
         

const prefix = '/back/tuuhen_ov'

export const service = {
    all,
    create,
    update,
    about,
    tsegPersonal,
    tsegUstsan,
    tsegPersonalAll,
    tsegPersonalRemove,
    dursgaltGazarCreate,
    dursgaltGazarAll,
    dursgaltGazarRemove,
    dursgaltGazarAbout,
    tsegUstsanAll,
    tseg_remove,
    tsegustsanEdit,
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

function tsegPersonalAll() {
    const requestOptions = {
        ...getGetOptions(),
    }
    return fetch(`${prefix}/tseg-personal/all/`, requestOptions).then(handleResponse)
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
        body: JSON.stringify({form_datas}),
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

function tsegUstsanAll() {
    const opts = {
        ...getGetOptions(),
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
    console.log(id)
    const opts = {
        ...getPostOptions(),
        body: JSON.stringify({id}),
    }
    return fetch(`${prefix}/tseg-ustsan_edit/`, opts).then(handleResponse)
}
