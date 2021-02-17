import {getGetOptions, getPostOptions, handleResponse} from '../../helpers/service'


const covid = {

    get: function() {
        const requestOptions = getGetOptions()
        return fetch('/back/api/config/covid/', requestOptions).then(handleResponse)
    },

    save: function(values) {
        const opts = {
            ...getPostOptions(),
            body: JSON.stringify(values),
        }
        return fetch('/back/api/config/covid/save/', opts).then(handleResponse)
    },

}

export const service = {
    config: {
        covid: covid,
    }
}

