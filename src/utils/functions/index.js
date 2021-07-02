// import utils from "@helpUtils/functions" -- бүх функцийг нэг хувьсагчинд хийж дуудах
export default {
    test,
    makeStateColor,
    makeKindColor,
    checkMultiGeomTypeName,
}

// import { test } from "@helpUtils/functions" -- тухайн дуудах функээ л дуудах
export {
    test,
    makeStateColor,
    makeKindColor,
    checkMultiGeomTypeName,
}

//TODO энэ жишээ ийм маягаар явна
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
