// import * as utils from "@helpUtils/functions" -- бүх функцийг нэг хувьсагчинд хийж дуудах
// import { test } from "@helpUtils/functions" -- тухайн дуудах функээ л дуудах
export {
    test,
    makeStateColor,
    makeKindColor,
    checkMultiGeomTypeName,
    copyToClipboard,
    logicOp,
    sortArrayOfObj,
    getUrlParamValue,
}

//энэ жишээ ийм маягаар явна
function test(params) {
    alert("it worked")
    return params
}

function makeStateColor (state) {
    const obj = {
        "ШИНЭ": 'text-success',
        "ИЛГЭЭСЭН": 'text-warning',
        "ШИЙДВЭРЛЭГДСЭН": 'text-primary',
    }
    return obj[state] ? obj[state] : ''
}

function makeKindColor (kind) {
    const obj = {
        "ШИЙДВЭРЛЭГДСЭН": 'text-success',
        "ХҮЛЭЭГДЭЖ БУЙ": 'text-warning',
        "ЦУЦЛАСАН": 'text-danger',
        "БУЦААГДСАН": 'text-danger',
        "ШИНЭ": 'text-primary',
        "БАТАЛГААЖСАН": 'text-success',
    }
    return obj[kind] ? obj[kind] : ''
}

// geometr turul shalgaad Multi gesen bku bol nemj ugdug
function checkMultiGeomTypeName(geom_type) {

    if(geom_type.includes("Multi")) { geom_type }
    else {
        geom_type = 'Multi'.concat('', geom_type)
    }
    return geom_type
}

// хуулах text ээ өгөөд тэр text ийг copy нд нь оруулж өгнө
function copyToClipboard(text, notif_text='Амжилттай хууллаа') {
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    if (global.NOTIF) {
        global.NOTIF('success', notif_text, 'check')
    }
}

// string дээр хэрэглэгдэх logic үйлдэл энэ функцээс хэрэглэж болно
function logicOp(op_name, a, b) {
    if (op_name == 'exact') {
        return a == b
    }
    return a[op_name](b)
}

// objected array ыг эрэмблэх, эрэмбэлэх key ээ өгнө
function sortArrayOfObj(array, key, is_reverse=false) {
    array.sort((a, b) => {
        let first = a
        let second = b
        if (is_reverse) {
            first = b
            second = a
        }
        return first[key] - second[key]
    })
    return array
}

function getUrlParamValue(url, param_name) {
    let split_url = url.split("?")
    split_url = split_url[split_url.length - 1]

    let params = split_url.split('&')
    for(const idx in params) {
        let param = params[idx]
        let [key, value] = param.split('=')
        if (param_name.toLowerCase() === key.toLowerCase()) {
            return value
        }
    }

    return ''
}
