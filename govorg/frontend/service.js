import { handleResponse, getGetOptions } from './Components/helpers/service'


export const service = {
    tableListTeevriinSuljee,
    tableListBairZuinZurag,
    tableListBarilgaSuurinGazar,
    tableListDedButets
}

function tableList(){
	teevriin_suljee = _tableListTeevriinSuljee().then({items})
	ded_butets = _tableListDedButets().then({items})
	bair_zuin_zurag = _tableListBairZuinZurag().then({items})
	barilga_suurin_gazar_table_list = _tableListBarilgaSuurinGazar().then({items})

	return (teevriin_suljee, ded_butets, bair_zuin_zurag, bair_zuin_zurag)
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
