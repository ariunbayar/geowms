import { handleResponse, getGetOptions, getPostOptions} from "../helpers/service"


export const service = {
    userInfo,
    updateEmail,
}


function userInfo() {
    const rsp = {
        ...getGetOptions(),
    }
    return fetch(`/profile/information/`, rsp).then(handleResponse)
}


function updateEmail(email) {
    const response = {
        ...getPostOptions(),
        body: JSON.stringify({ email }),
    }
    return fetch(`/profile/updateEmail/`, response).then(handleResponse)
}
