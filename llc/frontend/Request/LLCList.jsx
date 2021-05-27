import React, { Component, Fragment } from "react";
import { PortalDataTable } from '@utils/DataTable/index'
import DirectModal from  './DirectModal'
import Modal from '@utils/Modal/Modal'


export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else if (state == "ТАТГАЛЗСАН") color = 'text-danger'
    else if (state == "ЗӨВШӨӨРСӨН") color = 'text-success'
    return color
}

export const make_kind_color = (kind) => {
    let color
    if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-success'
    else if (kind == "ЗАССАН") color = 'text-primary'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "УСТГАСАН") color = 'text-danger'
    else if (kind == "ШУУД") color = 'text-danger'
    return color
}

export const make_send_data = (values) => {
    return (
        <a
            type="button"
            href={'/media/' + values.values.file_path}
            target="_blank"
            className="
                btn text-light animated bounceIn bg-danger
            "
        >
        <i className="fa fa-download"> &nbsp; Татах</i>
        </a>
    )

}


export class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh:false,
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
                        "action": (values) => this.handeUpdateAction(values),
                    },
                    {
                        "title": 'Илгээх',
                        "text": '',
                        "icon": 'fa fa-paper-plane-o text-primary',
                        "action": (values) => this.sendData(values),
                    },
                    {
                        "title": 'Устгах',
                        "text": '',
                        "icon": 'fa fa-trash-o text-danger',
                        "action": (values) => this.handleRemoveAction(values),
                    },
                    {
                        "title": '',
                        "text": 'татах',
                        "icon": 'text-primary',
                        'component': (values) => make_send_data(values)
                    }
            ],
            modal_status:'closed',
            request_form:false
        }
        this.refreshData = this.refreshData.bind(this)
        this.handeUpdateAction = this.handeUpdateAction.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)

        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
    }

    handeUpdateAction(values) {
        this.props.history.push(`/llc/llc-request/${values.id}/дэлгэрэнгүй/`)
    }

    handleRemoveAction(values){
        this.setState({values})
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

    modalChange(modal_icon, icon_color, title, text, has_button) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
        })
        this.modalOpen()
    }

    modalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handleRemove(){
        this.modalChange(
            'fa fa-check-circle',
            "success",
            'Амжилттай устгалаа',
            '',
            false
        )
    }
    refreshData(){
        this.setState({ refresh: !this.state.refresh })
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh }= this.state
        return (
            <Fragment>
                <div className="card">
                    <div className="card-body">
                        <div className="col-md-12 row">
                                <div className="col-md-6">
                                    <label htmlFor="">Төлөв</label>
                                    <select className="form-control form-control-xs"
                                        onChange={(e) => this.setState({ state: e.target.value })}
                                    >
                                        {/* <option value="">--- Төлөвөөр хайх ---</option>
                                        {
                                            choices && choices.length > 0
                                            ?
                                                choices[0].map((choice, idx) =>
                                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                                )
                                            :
                                            null
                                        } */}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Өөрчлөлт</label>
                                    <select className="form-control form-control-sm"
                                        onChange={(e) => this.setState({ kind: e.target.value })}
                                    >
                                        {/* <option value="">--- Өөрчлөлтөөр хайх ---</option>
                                        {
                                            choices && choices.length > 0
                                            ?
                                                choices[1].map((choice, idx) =>
                                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                                )
                                            :
                                            null
                                        } */}
                                    </select>
                                </div>
                                <button className="btn gp-btn-primary d-flex justify-content-center m-3 float-right" /*onClick={() => this.handleSearch()}*/>Хайх</button>
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
                    />
                </div>
            </Fragment>
        )
    }
}
