import { handleResponse, getGetOptions, getPostOptions} from "../helpers/service"

export const service = {
    userInfo,
    updateEmail
}

function userInfo (){
    const rsp = {
        ...getGetOptions(),
    }
    return fetch(`/profile/api/information/`, rsp).then(handleResponse)
}


function updateEmail (){
    const response = {
        ...getPostOptions(),
    }
    return fetch(`/profile/api/information/updateEmail/`, response).then(handleResponse)
}
