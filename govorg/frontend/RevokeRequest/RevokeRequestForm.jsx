
import React, { Component } from "react"
import {service} from './service'
import { PortalDataTable } from '@utils/DataTable/index'
import MakeOronZai from './../OrgRequest/makeOronZai'
import OpenMapModal from './../OrgRequest/openMapModal'



const make_org_employee = ({values}) => {
    return values.org + '/' + values.employee
}

export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-warning'
    else if (state == "ТАТГАЛЗСАН") color = 'text-danger'
    else if (state == "ЗӨВШӨӨРСӨН") color = 'text-success'
    else if (state == "ХЯНАХ") color = 'text-success'
    return color
}

export default class RevokeRequestForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            is_loading: false,
            search_query: '',
            current_page: 1,
            revoke_per_page: 20,
            list_length: null,
            search_state: '',
            state: null,
            kind: null,
            search_geom: null,
            theme_id: null,
            package_id: null,
            feature_id: null,
            is_loading: false,
            refresh: false,
            талбарууд: [
                {'field': 'theme_name', "title": 'Орон зайн өгөгдөл', 'has_action': false, 'is_sort': true },
                {'field': 'org', "title": 'Байгууллага / мэргэжилтэн', 'has_action': true},
                {'field': 'order_no', "title": 'Тушаалын дугаар'},
                {'field': 'order_at', "title": 'Тушаал гарсан огноо'},
                {'field': 'created_at', "title": 'Огноо'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
            ],
            жагсаалтын_холбоос: '/gov/api/revoke_request/',
            хувьсах_талбарууд: [
                {"field": "org", "component": make_org_employee},
                {
                    "field": "theme_name",
                    "component": MakeOronZai,
                    'props': {
                        'refreshData': () => this.refreshData(),
                    }
                },
                {"field": "state", "action": (values) => make_state_color(values) , "action_type": true},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Шийдвэрлэх',
                    'component': OpenMapModal,
                    'props': {
                        'button_name' : 'Шийдвэрлэх',
                        'hide_btn' : false,
                        'refreshData': () => this.refreshData(),
                    }
                },
                {
                    "title": 'Харах',
                    'component': OpenMapModal,
                    'props': {
                        'button_name' : 'Үзэх',
                        'hide_btn' : true,
                        'refreshData': () => this.refreshData(),
                    }
                }
            ],
            custom_query: {}
        }
        this.setLoading = this.setLoading.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.refreshData = this.refreshData.bind(this)
    }


    componentDidMount() {
        service
            .getChoices()
            .then(({success, modules, choices}) => {
                if (success) {
                    this.setState({ modules, choices })
                }
            })
    }

    refreshData(){
        this.setState({ refresh: !this.state.refresh })
    }

    setLoading() {
        this.setState({ is_loading: true })
    }


    onChangeItems(value, field, main_module) {
        let module_value
        let for_search
        let remove_ids = Object()
        this.state[main_module].map((module, idx) => {
            if (module.id == value) {
                module_value = module[field]
            }
        })
        if (main_module == 'modules') {
            for_search = 'theme_id'
            remove_ids['package_id'] = null
            remove_ids['feature_id'] = null
        }
        else if (main_module == 'packages') {
            for_search = 'package_id'
            remove_ids['feature_id'] = null
        }
        this.setState({ [field]: module_value, [for_search]: value, ...remove_ids })
    }

    handleSearch() {
        const { field, state, theme_id, package_id, feature_id } = this.state
        let custom_query = Object()
        if (state) custom_query['state'] = state
        if (theme_id) custom_query['theme_id'] = theme_id
        if (package_id) custom_query['package_id'] = package_id
        if (feature_id) custom_query['feature_id'] = feature_id
        let remove_query = Object()
        if (!('theme_id' in custom_query)){
            if ('package_id' in custom_query) {
                delete custom_query['package_id']
                remove_query['package_id'] = null
            }
            if ('feature_id' in custom_query) {
                delete custom_query['feature_id']
                remove_query['feature_id'] = null
            }
        }

        if (!('package_id' in custom_query)){
            if ('feature_id' in custom_query) {
                delete custom_query['feature_id']
                remove_query['feature_id'] = null
            }
        }
        this.setState({ custom_query, ...remove_query })
    }


    render() {
        const { choices, modules } = this.state
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh } = this.state
        return (
            <div className="card">
                <div className="card-body">
                        <div className="col-md-12 row">
                                <div className="col-md-6">
                                    <label htmlFor="">Орон зайн өгөгдөл</label>
                                        <select className="form-control form-control-xs"
                                            onChange={(e) => this.onChangeItems(e.target.value, 'packages', 'modules')}
                                        >
                                        <option value=''>--- Дэд сангаар хайх ---</option>
                                        {
                                            modules && modules.length > 0
                                            ?
                                                modules.map((theme, idx) =>
                                                    <option key={idx} value={theme.id}>{theme.name}</option>
                                                )
                                            :
                                            null
                                        }
                                        </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Төлөв</label>
                                    <select className="form-control form-control-xs"
                                        onChange={(e) => this.setState({ state: e.target.value })}>
                                        <option value="">--- Төлөвөөр хайх ---</option>
                                        {
                                            choices && choices.length > 0
                                            ?
                                            choices[0].map((choice, idx) =>
                                                <option key={idx} value={choice[0]}>{choice[1]}</option>
                                            )
                                            :
                                            null
                                        }
                                    </select>
                                </div>
                                <button className="btn gp-btn-primary d-flex justify-content-center m-3 float-right" onClick={() => this.handleSearch()}>Хайх</button>
                        </div>
                        <br></br>
                        <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'primary'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                            max_data={'open'}
                            хайлт={'closed'}
                            sort_name={'-created_at'}
                            custom_query={this.state.custom_query}
                        />
                        </div>
                    </div>
                </div>
        )
    }
}
