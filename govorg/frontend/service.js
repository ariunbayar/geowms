import { handleResponse, getGetOptions, getPostOptions } from './components/helpers/service'


export const service = {
    tableListTeevriinSuljee,
    tableListBairZuinZurag,
    tableListBarilgaSuurinGazar,
    tableListDedButets,
    getCount,
}

function tableListTeevriinSuljee() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/teevriin_suljee/table_list/', requestOptions).then(handleResponse)
}

function tableListBairZuinZurag() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/bair_zuin_zurag/table_list/', requestOptions).then(handleResponse)
}

function tableListBarilgaSuurinGazar() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/barilga_suurin_gazar/table_list/', requestOptions).then(handleResponse)
}


function tableListDedButets() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/ded_butets/table_list/', requestOptions).then(handleResponse)
}

function getCount() {
    const requestOptions = {
        ...getGetOptions(),
    }

    return fetch(`/gov/api/org-request/getCount/`, requestOptions).then(handleResponse)
}
