import React, { Component, Fragment } from "react";

import { PortalDataTable } from '@utils/DataTable/index'
import Modal from '@utils/Modal/Modal'
import { service } from "../Request/service";
import { makeStateColor, makeKindColor } from '../helpers/functions'

export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            талбарууд: [
                {'field': 'client_org', "title": 'Захиалагч байгууллага'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Төрөл', 'has_action': true},
                {'field': 'created_at', "title": 'Үүсгэсэн'},
                {'field': 'updated_at', "title": 'Шинэчилсэн'},

            ],
            жагсаалтын_холбоос: `/llc/backend/${false}/llc-request-list/`,
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
                        "title": 'Устгах',
                        "text": '',
                        "icon": 'fa fa-trash-o text-danger',

                        "action": (values) => this.handleRemoveAction(values),
                    }
            ],
            state: '',
            kind: '',
            modal_status: 'closed',
            refresh: false,
            choices: [],
        }
        this.refreshData = this.refreshData.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
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
        this.props.history.push(`/llc/history/${values.id}/дэлгэрэнгүй/`)
    }

    handleRemoveAction(values){
        this.setState({ values })
        this.handleModalOpen(values)
    }

    handleModalOpen(values){
            this.modalChange(
                'fa fa-exclamation-circle',
                "warning",
                'Тохиргоог устгах',
                `Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
                true
            )
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
                                хувьсах_талбарууд={хувьсах_талбарууд}
                                нэмэлт_талбарууд={нэмэлт_талбарууд}
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