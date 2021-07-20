import { handleResponse, getGetOptions, getPostOptions} from "../helpers/service"

export const service = {
    userInfo,
    updateEmail,
}

function userInfo() {
    const rsp = {
        ...getGetOptions(),
    }
    return fetch(`/profile/api/info/`, rsp).then(handleResponse)
}

function updateEmail(email) {
    const response = {
        ...getPostOptions(),
        body: JSON.stringify({ email }),
    }
    return fetch(`/profile/api/set-email/`, response).then(handleResponse)
}
