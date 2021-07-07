import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom"

import { PortalDataTable } from '@utils/DataTable/index'
import Modal from '@utils/Modal/Modal'

import RequestModal from  './RequestModal'
import { service } from "./service";
import { makeStateColor, makeKindColor } from '../helpers/functions'

export class FileAndDesc extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        const { values } = this.props
        if (values.state == 'ШИЙДВЭРЛЭГДСЭН') var hidden = 'd-none'
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
                                className={`btn animated bounceIn text-light bg-danger ${hidden}`}
                                style={
                                    {
                                        padding: 4,
                                        backgroundColor: '#fd355е',
                                        borderColor: '#fd355е',
                                        borderRadius: '.25rem'
                                    }
                                }
                            >
                                <i className="fa fa-download"> &nbsp; Татах</i>
                            </NavLink>
                            <button
                                className={`btn border rounded animated bounceIn text-light ${!hidden && 'mx-1'}`}
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
                {'field': 'client_org', "title": 'Захиалагч байгууллага'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
                {'field': 'created_at', "title": 'Үүсгэсэн'},
                {'field': 'updated_at', "title": 'Шинэчилсэн'},

            ],
            жагсаалтын_холбоос: `/llc/backend/${true}/llc-request-list/`,
            хувьсах_талбарууд: [
                {"field": "state", "action": (values) => makeStateColor(values) , "action_type": true},
                {"field": "kind", "action": (values) => makeKindColor(values), "action_type": true},
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
        this.infoModal = this.infoModal.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
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
    refreshData() {
        this.setState({ refresh: !this.state.refresh })
    }

    handleSearch(e, field) {
        let custom_query = Object()
        var value = parseInt(e.target.value)

        if (field == 'state') {
            if (e.target.value) custom_query['state'] = value
            else delete custom_query['state']
            if (this.state.kind) custom_query['kind'] = this.state.kind
        }
        else {
            if (value) custom_query['kind'] = value
            if (this.state.state) custom_query['state'] = this.state.state
        }
        this.setState({ custom_query, [field]: value })
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

    handleRemoveAction(values){
        this.setState({ values })
        this.handleModalOpen()
    }

    handleModalOpen(){
        const modal = {
            modal_status: 'open',
            modal_icon: `fa fa-exclamation-circle`,
            icon_color: 'warning',
            title: 'Устгах',
            text: 'Та хүсэлтийг устгахдаа итгэлтай байна уу ',
            has_button: true,
            actionNameBack: 'Буцах',
            actionNameDelete: 'устгах',
            modalAction: this.handleRemove,
        }
        global.MODAL(modal)
    }

    handleRemove() {
        const { id } = this.state.values
        service.removeRequest(id).then(({ success, info }) => {
            if(success) {
                const modal = {
                    modal_status: 'open',
                    modal_icon: 'fa fa-check-circle',
                    icon_color: "success",
                    title: 'Амжилттай уcтгалаа',
                    text: '',
                }
                global.MODAL(modal)
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
                const modal = {
                    modal_status: 'open',
                    modal_icon: 'fa fa-check-circle',
                    icon_color: "success",
                    title: 'Хүсэлт амжилтгүй боллоо',
                    text: '',
                }
                global.MODAL(modal)
                this.refreshData()
                this.refreshData()
            }
        })
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
                                    onChange={(e) => this.handleSearch(e, 'state')}
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
                                <select className="form-control form-control-xs"
                                    onChange={(e) => this.handleSearch(e, 'kind')}
                                >
                                    <option value="">--- Өөрчлөлтөөр хайх ---</option>
                                    {
                                        choices?.kind
                                        ?
                                            choices['kind'].map((choice, idx) =>
                                                <option
                                                    key={idx}
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
                        actionNameBack={ this.state.actionNameBack }
                        actionNameDelete={ this.state.actionNameDelete }
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
