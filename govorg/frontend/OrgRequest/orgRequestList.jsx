
import React, { Component } from "react"

import {service} from './service'
import ModalAlert from "@utils/Modal/ModalAlert"
import { PortalDataTable } from '@utils/DataTable/index'
import RequestModal from './requestModal'

class OpenMapModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
            title: props.button_name || 'Шийдвэрлэх'
        }
        this.openModalMapMap = this.openModalMapMap.bind(this)
        this.closeModalMap = this.closeModalMap.bind(this)
    }

    openModalMapMap() {
        this.setState({ is_modal_request_open: true })
    }

    closeModalMap() {
        this.setState({ is_modal_request_open: false })
    }

    render() {
        const { is_modal_request_open, title } = this.state
        const { values, button_name } = this.props
        const { state, geo_json } = values
        if (!button_name) {
            this.values = [values]
        } else {
            this.values = values
        }
        return (
            <div>
                {
                    state == "ШИНЭ" && geo_json || button_name
                    ?
                        <a
                            className="btn btn-primary btn-sm"
                            onClick={this.openModalMapMap}
                        >
                            {title}
                        </a>
                    :
                        null
                }
                {is_modal_request_open &&
                    <RequestModal
                        modalClose={this.closeModalMap}
                        modalAction={() => this.handleRequestApprove(id)}
                        title={title}
                        button_name={button_name}
                        values={this.values}
                    />
                }
            </div>
        )
    }
}

class MakeOronZai extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show_group: false,
            values: props.values,
            fields:[
                {'mn_name': 'Геом дугаар', 'eng_name': 'old_geo_id'},
                {'mn_name': 'Төлөв', 'eng_name': 'state'},
                {'mn_name': 'Өөрчлөлт', 'eng_name': 'kind'},
            ],
            collection_of_value: []
        }
        this.showGroup = this.showGroup.bind(this)
    }

    showGroup() {
        const { values } = this.state
        if (values.group) {
            this.setState({ show_group: !this.state.show_group })
        }
    }

    collectValue(e, value) {
        const { collection_of_value } = this.state
        if (e.target.checked) {
            collection_of_value.push(value)
        }
        else {
            collection_of_value.map((c_value, idx) => {
                if (value.id == c_value.id) {
                    collection_of_value.splice(idx, 1)
                }
            })
        }
        this.setState({ collection_of_value })
    }

    render() {
        const { show_group, fields, values, collection_of_value } = this.state
        const { group, theme_name, package_name, feature_name } = values
        return (
            <div>
                <span className={group ? "btn " : ''} onClick={this.showGroup}>
                    {theme_name} / {package_name} / {feature_name}
                </span>
                {show_group && <br />}
                {
                    show_group
                    ?
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>№</th>
                                    {fields.map((field, idx) =>
                                        <th key={idx}>
                                            {field.mn_name}
                                        </th>
                                    )}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.map((value, g_idx) =>
                                    <tr key={g_idx} htmlFor={g_idx}>
                                        {
                                            value.state != 'Зөвшөөрсөн' || value.state != 'Устгасан'
                                            ?
                                                <td>
                                                    <input id={g_idx}
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        onChange={(e) => this.collectValue(e, value)}
                                                    />
                                                </td>
                                            :
                                                null
                                        }
                                        <th>{g_idx + 1}</th>
                                        {fields.map((field, idx) =>
                                            field.eng_name == 'state'
                                            ?
                                                <td key={idx}
                                                    className={
                                                        value[field.eng_name] == 'ШИНЭ' ? 'text-primary' :
                                                        value[field.eng_name] == 'ТАТГАЛЗСАН' ? 'text-danger' :
                                                        value[field.eng_name] == 'ЗӨВШӨӨРСӨН' ? 'text-success':
                                                        value[field.eng_name] == 'ХЯНАХ' ? 'text-success': null
                                                    }
                                                >
                                                    {value[field.eng_name]}
                                                </td>
                                            :
                                            field.eng_name == 'kind'
                                            ?
                                                <td key={idx}
                                                    className={
                                                        value[field.eng_name] == 'ҮҮССЭН' ? 'text-success' :
                                                        value[field.eng_name] == 'ЗАССАН' ? 'text-primary' :
                                                        value[field.eng_name] == 'ЦУЦЛАСАН' ? 'text-danger':
                                                        value[field.eng_name] == 'УСТГАСАН' ? 'text-danger':
                                                        value[field.eng_name] == 'ШУУД' ? 'text-danger': null
                                                    }
                                                >
                                                    {value[field.eng_name]}
                                                </td>
                                            :
                                                <td key={idx}>
                                                   <label htmlFor={g_idx} className="form-check-label">
                                                       {value[field.eng_name]}
                                                    </label>
                                                </td>
                                        )}
                                        <td>
                                            <OpenMapModal values={value}/>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    :
                        null
                }
                {
                    collection_of_value.length > 0
                    ?
                        <OpenMapModal values={collection_of_value} button_name={'Олноор шийдвэрлэх'}/>
                    :
                        null
                }
            </div>
        )
    }
}

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
                {"field": "theme_name", "component": MakeOronZai},
                {"field": "state", "action": (values) => this.make_state_color(values) , "action_type": true},
                {"field": "kind", "action": (values) => this.make_kind_color(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [{
                "title": 'Шийдвэрлэх',
                'component': OpenMapModal,
            }],
            is_modal_request_open: false,
        }

        this.getAll = this.getAll.bind(this)
        this.onChangeTheme = this.onChangeTheme.bind(this)
        this.modalAlertOpen = this.modalAlertOpen.bind(this)
        this.modalAlertClose = this.modalAlertClose.bind(this)
        this.modalAlertCloseTime = this.modalAlertCloseTime.bind(this)
        this.openModalMap = this.openModalMap.bind(this)

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
    }

    modalAlertClose(){
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalAlertCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    componentDidMount(){
    }

    handleRequestApprove(id){
        const values = this.state.values
        service.requestApprove(id, values).then(({ success, info })=>{
            if(success)
            {
                this.setState({ is_loading: false })
                this.props.getAll()
                this.handleRequestClose()
                this.props.modalAlertOpen(info, "success")
            }
            else
            {
                this.setState({ is_loading: false })
                this.handleRequestClose()
                this.props.modalAlertOpen(info, "warning")
            }
        }).catch((error) => {
            if(error == 'Bad Request')
            {
                this.setState({ is_loading: false })
                this.handleRequestClose()
                this.props.modalAlertOpen("Алдаа гарлаа. Обьект олдсонгүй.", "danger")
            }
        })
    }

    getAll(){
        this.setState({ is_loading: true })
        service.getAll().then(({ success ,org_request, choices, modules }) => {
            if(success){
                this.themes = []
                this.packages = []
                this.features = []
                modules.map((module, idx) => {
                    this.themes.push(module)
                    module.packages.map((mods, idx) => {
                        this.packages.push(mods)
                        mods.features.map((mod, idx) => {
                            this.features.push(mod)
                        })
                    })
                })
            this.setState({org_request, is_loading: false, choices, modules, themes: this.themes, packages: this.packages, features: this.features})
            }
            else this.setState({is_loading:false})
        }).catch((error) => {
            this.modalAlertOpen("Алдаа гарлаа. Обьект олдсонгүй.", "danger")
        })
    }

    handleSearch() {
        const {search_state, search_kind, search_theme, search_package, search_feature} = this.state
        this.setState({ is_loading: true })
        service
            .requestSearch(search_state, search_kind, search_theme, search_package, search_feature)
            .then(({ success ,org_request, info }) => {
                if(success){
                    this.setState({ org_request, is_loading: false })
                } else {
                    this.modalAlertOpen(info, 'warning')
                }
            }).catch((error) => {
                this.modalAlertOpen("Алдаа гарлаа. Обьект олдсонгүй.", "danger")
            })
    }

    onChangeTheme(value, type) {
        const { modules } = this.state
        this.themes = []
        this.packages = []
        this.features = []
        modules.map((module, idx) => {
            if (type == 'theme' && module.id == value){
                this.themes.push(module)
            } else if (value === '') {
                this.themes.push(module)
            }
        })
        this.themes.map((mods, idx) => {
            mods.packages.map((pack, idx) => {
                    this.packages.push(pack)
            })
        })
        this.packages.map((mod, idx) => {
            mod.features.map((feat, idx) => {
                this.features.push(feat)
            })
        })
        this.setState({ packages: this.packages, features: this.features, search_theme: value })
    }

    onChangePackage(value, type) {
        const { packages } = this.state
        this.themes = []
        this.packages = []
        this.features = []
        packages.map((mod, idx) => {
            if (type == 'package', mod.id == value) {
                this.setState({ search_package: value })
                mod.features.map((feat, idx) => {
                    this.features.push(feat)
                })
            } else if (value == '') {
                mod.features.map((feat, idx) => {
                    this.features.push(feat)
                })
            }
        })
        this.setState({features: this.features})
    }

    render() {
        const org_request = this.state.org_request
        const {is_loading, choices, packages, features, themes, title, model_type_icon, modal_alert_status} = this.state
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд } = this.state
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
                        color={'primary'}
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        per_page={100}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэлт_талбарууд={нэмэлт_талбарууд}
                        хайлт={'closed'}
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
