import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom"

import { PortalDataTable } from '@utils/DataTable/index'
import Modal from '@utils/Modal/Modal'

import RequestModal from  './RequestModal'
import { service } from "./service";

export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else  color = 'text-warning'
    return color
}

export const make_kind_color = (kind) => {
    let color
    if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-success'
    else if (kind == "ШИЙДВЭРЛЭГДСЭН") color = 'text-success'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    else if (kind == "ШИНЭ") color = 'text-primary'
    return color
}

export class FileAndDesc extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        const { values } = this.props
        return (
            <div className='p-0'>
                {
                    (values.kind == "БУЦААГДСАН" || values.kind == "ЦУЦЛАСАН")
                    &&
                        <div className="p-0 d-flex justify-content-between btn-group">
                            <NavLink
                                type="button"
                                to={'/media/' + values.file_path}
                                target="_blank"
                                className="btn animated bounceIn text-light bg-danger"
                                style={{
                                    padding: 4,
                                    backgroundColor: '#fd355е',
                                    borderColor: '#fd355е',
                                    borderRadius: '.25rem'
                                }}
                            >
                                <i className="fa fa-download"> &nbsp; Татах</i>
                            </NavLink> &nbsp; &nbsp;
                            <button
                                className="btn border rounded animated bounceIn text-light"
                                style={{
                                    padding: 4,
                                    backgroundColor: '#ff9700',
                                    borderColor: '#ff9700',
                                    borderRadius: '.25rem'
                                }}
                                onClick={()=> this.props.infoModal(values)}
                            >
                                <i className="fa fa-info-circle"> &nbsp; Тайлбар</i>
                            </button>
                        </div>
                }
            </div>
        )
    }
}

export class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            талбарууд: [
                {'field': 'name', "title": 'Захиалагч байгууллага'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
                {'field': 'created_at', "title": 'Үүсгэсэн'},
                {'field': 'updated_at', "title": 'Шинэчилсэн'},

            ],
            жагсаалтын_холбоос: '/llc/backend/llc-request-list/',
            хувьсах_талбарууд: [
                {"field": "state", "action": (values) => make_state_color(values) , "action_type": true},
                {"field": "kind", "action": (values) => make_kind_color(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [
                    {
                        "title": 'дэлгэрэнгүй',
                        "text": '',
                        "icon": 'fa fa-eye text-primary',
                        "action": (values) => this.handleUpdateAction(values),
                    },
                    {
                        "title": 'Илгээх',
                        'component': RequestModal,
                        'props': {
                            'refreshData': () => this.refreshData(),
                            'modal_status': this.modal_status,
                        }
                    },
                    {
                        "title": 'Устгах',
                        "text": '',
                        "icon": 'fa fa-trash-o text-danger',

                        "action": (values) => this.handleRemoveAction(values),
                    },
                    {
                        "title": '',
                        'component': FileAndDesc,
                        'props': {
                            'infoModal': (values) => this.infoModal(values),
                        }
                    }
            ],
            state: '',
            kind: '',
            modal_status: 'closed',
            request_form: false,
            choices: [],
        }
        this.refreshData = this.refreshData.bind(this)
        this.handleUpdateAction = this.handleUpdateAction.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.infoModal = this.infoModal.bind(this)

        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
    }

    componentDidMount(){
        service.getSearchItems().then(({ success, search_field }) =>{
            if (success){
                this.setState({ choices: search_field })
            }
        })

    }

    handleUpdateAction(values) {
        this.props.history.push(`/llc/llc-request/${values.id}/дэлгэрэнгүй/`)
    }

    handleRemoveAction(values){
        this.setState({ values })
        this.handleModalOpen(values)
    }

    handleModalOpen(values){
        let not_rm_kind = 'ЦУЦЛАСАН'
        let not_rm_state = 'ИЛГЭЭСЭН'
        if(not_rm_kind == values.kind || not_rm_state == values.state) {
            this.modalChange(
                'fa fa-exclamation-circle',
                "danger",
                'Устгах боломжгүй',
                `"Энэхүү хүсэлт ${values.kind == 'ЦУЦЛАСАН' ? values.kind : values.state} төлөвт байгаа тул устгах боломжгүй`,
                false
            )
        }
        else {
            this.modalChange(
                'fa fa-exclamation-circle',
                "warning",
                'Тохиргоог устгах',
                `Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
                true
            )
        }
    }

    modalChange(modal_icon, icon_color, title, text, has_button, description) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            description: description,
        })
        this.modalOpen()
    }

    modalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handleRemove() {
        const { id } = this.state.values
        service.removeRequest(id).then(({ success, info }) => {
            if(success) {
                this.modalChange(
                    'fa fa-check-circle',
                    "success",
                    info,
                    '',
                    false
                )
                this.refreshData()
            }
            else {
                this.modalChange(
                    'fa fa-check-circle',
                    "danger",
                    info,
                    '',
                    false
                )
                this.refreshData()
            }
        })
    }

    refreshData() {
        this.setState({ refresh: !this.state.refresh })
    }

    handleSearch(e) {
        let custom_query = Object()
        var value = parseInt(e.target.value)

        var table_data = e.target.selectedIndex
        var optionElement = e.target.childNodes[table_data]
        var selected_data_name =  optionElement.getAttribute('name')

        if (selected_data_name == 'state') {
            if (e.target.value) custom_query['state'] = value
            if (this.state.kind) custom_query['kind'] = this.state.kind
        }
        else {
            if (value) custom_query['kind'] = value
            if (this.state.state) custom_query['state'] = this.state.state
        }

        this.setState({ custom_query, [selected_data_name]: value })
    }

    infoModal(values) {
        this.modalChange(
            'fa fa-info-circle',
            "warning",
            'Тайлбар',
            ModalText,
            false,
            values.description,
        )
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, choices } = this.state
        return (
            <Fragment>
                <div className="card">
                    <div className="card-body">
                        <div className="col-md-12 row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="">Төлөв</label>
                                <select
                                    className="form-control form-control-xs"
                                    onChange={(e) => this.handleSearch(e)}
                                >
                                    <option value="">--- Төлөвөөр хайх ---</option>
                                    {
                                        choices?.state
                                        ?
                                            choices['state'].map((choice, idx) =>
                                                <option key={idx} name='state' value={choice[0]}>{choice[1]}</option>
                                            )
                                        :
                                            null
                                    }
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="">Өөрчлөлт</label>
                                <select className="form-control form-control-sm disabled"
                                    onChange={(e) => this.handleSearch(e)}
                                >
                                    <option value="">--- Өөрчлөлтөөр хайх ---</option>
                                    {
                                        choices?.kind
                                        ?
                                            choices['kind'].map((choice, idx) =>
                                                <option
                                                    ey={idx}
                                                    name='kind'
                                                    value={choice[0]}
                                                >
                                                    {choice[1]}
                                                </option>
                                            )
                                        :
                                        null
                                    }
                                </select>
                            </div>
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
                                нэмэх_товч={'/llc/llc-request/хүсэлт-нэмэх/'}
                                custom_query={this.state.custom_query}
                                хайлт="closed"
                                max_data="closed"
                            />
                        </div>
                    </div>
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon={this.state.modal_icon}
                        icon_color={this.state.icon_color}
                        title={this.state.title}
                        has_button={this.state.has_button}
                        text={this.state.text}
                        modalAction={this.handleRemove}
                        actionNameDelete="Устгах"
                        description={this.state.description}
                    />
                </div>
            </Fragment>
        )
    }
}

function ModalText(props) {
    return (
        <span className="text-center">
            {props.description}
        </span>
    )
}
