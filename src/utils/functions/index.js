// import utils from "@helpUtils/functions" -- бүх функцийг нэг хувьсагчинд хийж дуудах
export default {
    test
}

// import { test } from "@helpUtils/functions" -- тухайн дуудах функээ л дуудах
export {
    test
}

//TODO энэ жишээ ийм маягаар явна
function test(params) {
    alert("it worked")
    return params
}
