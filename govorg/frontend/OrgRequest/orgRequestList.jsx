
import React, { Component } from "react"

import ModalAlert from "@utils/Modal/ModalAlert"
import { PortalDataTable } from '@utils/DataTable/index'
import MakeOronZai from './makeOronZai'
import OpenMapModal from './openMapModal'

const make_org_employee = ({values}) => {
    return values.org + '/' + values.employee
}

export default class OrgRequestList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            org_request: [],
            search_state: null,
            search_kind: null,
            search_geom: null,
            search_theme: null,
            search_package: null,
            search_feature: null,
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
                {"field": "state", "action": (values) => this.make_state_color(values) , "action_type": true},
                {"field": "kind", "action": (values) => this.make_kind_color(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [{
                "title": 'Шийдвэрлэх',
                'component': OpenMapModal,
                'props': {
                    'refreshData': (is_modal, title, model_type_icon) => this.refreshData(is_modal, title, model_type_icon),
                },
            }],
            is_modal_request_open: false,
        }

        this.modalAlertOpen = this.modalAlertOpen.bind(this)
        this.modalAlertClose = this.modalAlertClose.bind(this)
        this.modalAlertCloseTime = this.modalAlertCloseTime.bind(this)
        this.openModalMap = this.openModalMap.bind(this)
        this.refreshData = this.refreshData.bind(this)

    }

    make_state_color(state) {
        let color
        if (state == "ШИНЭ") color = 'text-primary'
        else if (state == "ТАТГАЛЗСАН") color = 'text-danger'
        else if (state == "ЗӨВШӨӨРСӨН") color = 'text-success'
        else if (state == "ХЯНАХ") color = 'text-success'
        return color
    }

    make_kind_color(kind) {
        let color
        if (kind == "ҮҮССЭН") color = 'text-success'
        else if (kind == "ЗАССАН") color = 'text-primary'
        else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
        else if (kind == "УСТГАСАН") color = 'text-danger'
        else if (kind == "ШУУД") color = 'text-danger'
        return color
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

    render() {
        const {choices, packages, features, themes, title, model_type_icon, modal_alert_status} = this.state
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh } = this.state
        return (
            <div className="row">
                <div className="col-md-12 row">
                    <div className="col-md-6">
                        <label htmlFor="">Төлөв</label>
                        <select className="form-control form-control-sm"
                            onChange={(e) => this.setState({ search_state: e.target.value })}>
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
                            onChange={(e) => this.setState({ search_kind: e.target.value })}
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
                                    onChange={(e) => this.onChangeTheme(e.target.value, 'theme')}
                                >
                                <option value=''>--- Дэд сангаар хайх ---</option>
                                {
                                    themes && themes.length > 0
                                    ?
                                        themes.map((module, idx) =>
                                            <option key={idx} value={module.id}>{module.name}</option>
                                        )
                                    :
                                    null
                                }
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select className="form-control form-control-sm"
                                    onChange={(e) => this.onChangePackage(e.target.value, 'package')}
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
                                    onChange={(e) => this.setState({ search_feature: e.target.value })}
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
                        per_page={100}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэлт_талбарууд={нэмэлт_талбарууд}
                        хайлт={'closed'}
                        sort_name={'-created_at'}
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
