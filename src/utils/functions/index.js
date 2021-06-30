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
    return obj[state]
}

function makeKindColor (kind) {
    let color
    if (kind == "ШИЙДВЭРЛЭГДСЭН") color = 'text-success'
    else if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-warning'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    else if (kind == "ШИНЭ") color = 'text-primary'
    else if (kind == "БАТАЛГААЖСАН") color = 'text-success'
    return color
}

// geometr turul shalgaad Multi gesen bku bol nemj ugdug
function checkMultiGeomTypeName(geom_type) {

    if(geom_type.includes("Multi")) { geom_type }
    else {
        geom_type = 'Multi'.concat('', geom_type)
    }
    return geom_type
}
