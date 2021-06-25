// import utils from "@helpUtils/functions" -- бүх функцийг нэг хувьсагчинд хийж дуудах
export default {
    test,
    makeStateColor,
    makeKindColor,
}

// import { test } from "@helpUtils/functions" -- тухайн дуудах функээ л дуудах
export {
    test,
    makeStateColor,
    makeKindColor,

}

//TODO энэ жишээ ийм маягаар явна
function test(params) {
    alert("it worked")
    return params
}

function makeStateColor (state) {
    let color
    if (state == "ШИНЭ") color = 'text-success'
    else if (state == "ИЛГЭЭСЭН") color = 'text-warning'
    else if (state == "ШИЙДВЭРЛЭГДСЭН") color = 'text-primary'
    return color
}

function makeKindColor (kind) {
    let color
    if (kind == "ШИЙДВЭРЛЭГДСЭН") color = 'text-success'
    else if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-warning'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    else if (kind == "ШИНЭ") color = 'text-primary'
    return color
}
