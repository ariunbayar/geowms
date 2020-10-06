import { handleResponse, getGetOptions } from './Components/helpers/service'


export const service = {
    tableListBarilgaSuurinGazar
}


function tableListBarilgaSuurinGazar() {
    const requestOptions = getGetOptions()

    return fetch('/gov/api/barilga_suurin_gazar/table_list/', requestOptions).then(handleResponse)
}
