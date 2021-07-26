import { handleResponse, getGetOptions, getPostOptions } from "@helpUtils/handleRequest"

const base_layer = {

    get: function() {
        const opts = getGetOptions()
        return fetch('/суурь-давхарга/', opts).then(handleResponse)
    },

}

export const service = {
    base_layer
}
