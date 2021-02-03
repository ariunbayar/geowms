
import React, { Component } from "react"

import ModalAlert from "@utils/Modal/ModalAlert"
import { PortalDataTable } from '@utils/DataTable/index'
import MakeOronZai from './makeOronZai'
import OpenMapModal from './openMapModal'
import { service } from "./service"

const make_org_employee = ({values}) => {
    return values.org + '/' + values.employee
}

export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else if (state == "ТАТГАЛЗСАН") color = 'text-danger'
    else if (state == "ЗӨВШӨӨРСӨН") color = 'text-success'
    else if (state == "ХЯНАХ") color = 'text-success'
    return color
}

export const make_kind_color = (kind) => {
    let color
    if (kind == "ҮҮССЭН") color = 'text-success'
    else if (kind == "ЗАССАН") color = 'text-primary'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "УСТГАСАН") color = 'text-danger'
    else if (kind == "ШУУД") color = 'text-danger'
    return color
}

export default class OrgRequestList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            org_request: [],
            state: null,
            kind: null,
            search_geom: null,
            theme_id: null,
            package_id: null,
            feature_id: null,
            is_loading: false,
            modal_alert_status: "closed",
            title: '',
            model_type_icon: '',
            refresh: false,
            талбарууд: [
                {'field': 'theme_name', "title": 'Орон зайн өгөгдөл', 'has_action': true},
                {'field': 'org', "title": 'Байгууллага / мэргэжилтэн', 'has_action': true},
                {'field': 'order_no', "title": 'Тушаалын дугаар'},
                {'field': 'order_at', "title": 'Тушаал гарсан огноо'},
                {'field': 'created_at', "title": 'Огноо'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
            ],
            жагсаалтын_холбоос: '/gov/api/org-request/',
            хувьсах_талбарууд: [
                {"field": "org", "component": make_org_employee},
                {
                    "field": "theme_name",
                    "component": MakeOronZai,
                    'props': {
                        'refreshData': (is_modal, title, model_type_icon) => this.refreshData(is_modal, title, model_type_icon),
                    }
                },
                {"field": "state", "action": (values) => make_state_color(values) , "action_type": true},
                {"field": "kind", "action": (values) => make_kind_color(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [{
                "title": 'Шийдвэрлэх',
                'component': OpenMapModal,
                'props': {
                    'refreshData': (is_modal, title, model_type_icon) => this.refreshData(is_modal, title, model_type_icon),
                },
            }],
            is_modal_request_open: false,
            custom_query: {}
        }

        this.modalAlertOpen = this.modalAlertOpen.bind(this)
        this.modalAlertClose = this.modalAlertClose.bind(this)
        this.modalAlertCloseTime = this.modalAlertCloseTime.bind(this)
        this.openModalMap = this.openModalMap.bind(this)
        this.refreshData = this.refreshData.bind(this)
        this.onChangeItems = this.onChangeItems.bind(this)
        this.handleSearch = this.handleSearch.bind(this)

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

    openModalMap(values) {
        this.setState({ values })
        this.setState({is_modal_request_open: true})
    }

    closeModalMap() {
        this.setState({is_modal_request_open: false})
    }

    modalAlertOpen(title, model_type_icon){
        this.setState({modal_alert_status: 'open', title, model_type_icon})
        this.modalAlertCloseTime()
    }

    modalAlertClose(){
        this.setState({ modal_alert_status: "closed", refresh: !this.state.refresh })
        clearTimeout(this.state.timer)
    }

    modalAlertCloseTime(){
        this.state.timer = setTimeout(() => {
            this.modalAlertClose()
        }, 2000)
    }

    refreshData(is_modal, title, model_type_icon){
        if (is_modal) {
            this.modalAlertOpen(title, model_type_icon)
        }
        else {
            this.setState({ refresh: !this.state.refresh })
        }
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
        const { state, kind, theme_id, package_id, feature_id } = this.state
        let custom_query = Object()
        if (state) custom_query['state'] = state
        if (kind) custom_query['kind'] = kind
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
        const {choices, packages, features, title, model_type_icon, modal_alert_status, modules} = this.state
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh } = this.state
        return (
            <div className="row">
                <div className="col-md-12 row">
                    <div className="col-md-6">
                        <label htmlFor="">Төлөв</label>
                        <select className="form-control form-control-sm"
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
                    <div className="col-md-6">
                        <label htmlFor="">Өөрчлөлт</label>
                        <select className="form-control form-control-sm"
                            onChange={(e) => this.setState({ kind: e.target.value })}
                        >
                            <option value="">--- Өөрчлөлтөөр хайх ---</option>
                            {
                                choices && choices.length > 0
                                ?
                                    choices[1].map((choice, idx) =>
                                        <option key={idx} value={choice[0]}>{choice[1]}</option>
                                    )
                                :
                                null
                            }
                        </select>
                    </div>
                    <div className="col-md-12">
                    <br/>
                    <label htmlFor="">Орон зайн өгөгдөл</label>
                        <div className="row">
                            <div className="col-md-4">
                                <select className="form-control form-control-sm"
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
                            <div className="col-md-4">
                                <select className="form-control form-control-sm"
                                    onChange={(e) => this.onChangeItems(e.target.value, 'features', 'packages')}
                                >
                                <option value="">--- Багцаас хайх ---</option>
                                {
                                    packages && packages.length > 0
                                    ?
                                        packages.map((module, idx) =>
                                            <option key={idx} value={module.id}>{module.name}</option>
                                        )
                                    :
                                    null
                                }
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select className="form-control form-control-sm"
                                    onChange={(e) => this.setState({ feature_id: e.target.value })}
                                >
                                <option value="">--- Давхаргаас хайх ---</option>
                                {
                                    features && features.length > 0
                                    ?
                                        features.map((module, idx) =>
                                            <option key={idx} value={module.id}>{module.name}</option>
                                        )
                                    :
                                    null
                                }
                                </select>
                            </div>
                        </div>
                    </div>
                    <button className="btn gp-btn-primary d-flex justify-content-center m-3 float-right" onClick={() => this.handleSearch()}>Хайх</button>
                </div>
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
                <ModalAlert
                    modalAction={() => this.modalAlertClose()}
                    status={modal_alert_status}
                    title={title}
                    model_type_icon={model_type_icon}
                />
            </div>
        )
    }
}
