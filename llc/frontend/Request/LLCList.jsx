import React, { Component, Fragment } from "react";
import { PortalDataTable } from '@utils/DataTable/index'
import DirectModal from  './DirectModal'
import RequestModal from  './RequestModal'
import Modal from '@utils/Modal/Modal'
import { render } from "react-dom";
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

export const make_send_data = (values) => {
    let kind = values.values.kind
    return (
        <div>
            {
                kind == "БУЦААГДСАН"
                &&
                <a
                    type="button"
                    href={'/media/' + values.values.file_path}
                    target="_blank"
                    className= "btn text-light animated bounceIn bg-danger"
                >
                <i className="fa fa-download"> &nbsp; Татах</i>
                </a>
        }
        </div>

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
                        "action": (values) => this.handleUpdateAction(values),
                    },
                    {
                        "title": 'Илгээх',
                        'component': RequestModal,
                        'props' :{
                            'refreshData': () => this.refreshData(),
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
                        "text": 'татах',
                        "icon": 'text-primary',
                        'component': (values) => make_send_data(values)
                    }
            ],
            state: '',
            kind: '',
            modal_status:'closed',
            request_form:false
        }
        this.refreshData = this.refreshData.bind(this)
        this.handleUpdateAction = this.handleUpdateAction.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)

        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
    }

    componentDidMount(){
        service.getSearchItems().then(({ success, search_field}) =>{
            if (success){
                this.setState({choices: search_field})
            }
        })

    }

    handleUpdateAction(values) {
        this.props.history.push(`/llc/llc-request/${values.id}/дэлгэрэнгүй/`)
    }

    handleRemoveAction(values){
        this.setState({values})
        this.handleModalOpen(values)
    }

    handleModalOpen(values){
        if(values.state =='ИЛГЭЭСЭН'){
            this.modalChange(
                'fa fa-exclamation-circle',
                "danger",
                'Устгах боломжгүй',
                `"Энэхүү хүсэлт илгээгдсэн төлөвт байгаа тул устгах боломжгүй`,
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
        const {id} = this.state.values
        service.RemoveRequest(id).then(({ success }) =>{
            if(success){
                this.modalChange(
                    'fa fa-check-circle',
                    "success",
                    'Амжилттай устгалаа',
                    '',
                    false
                )
                this.refreshData()
            }
        })
    }

    refreshData(){
        this.setState({ refresh: !this.state.refresh })
    }

    handleSearch() {
        const { state, kind } = this.state
        let custom_query = Object()
        if (state) custom_query['state'] = state
        if (kind) custom_query['kind'] = kind

        this.setState({ custom_query })
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, choices }= this.state
        return (
            <Fragment>
                <div className="card">
                    <div className="card-body">
                        <div className="col-md-12 row">
                                <div className="col-md-6">
                                    <label htmlFor="">Төлөв</label>
                                    <select className="form-control form-control-xs "
                                        onChange={(e) => this.setState({ state: e.target.value })}
                                    >
                                        <option value="">--- Төлөвөөр хайх ---</option>
                                        {
                                            choices?.state
                                            ?
                                                choices['state'].map((choice, idx) =>
                                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                                )
                                            :
                                            null
                                        }
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Өөрчлөлт</label>
                                    <select className="form-control form-control-sm disabled"
                                        onChange={(e) => this.setState({ kind: e.target.value })}
                                    >
                                        <option value="">--- Өөрчлөлтөөр хайх ---</option>
                                        {
                                            choices?.kind
                                            ?
                                                choices['kind'].map((choice, idx) =>
                                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                                )
                                            :
                                            null
                                        }
                                    </select>
                                </div>
                                <p className="btn-sm gp-btn-primary d-flex justify-content-center m-3 float-right " onClick={() => this.handleSearch()}>Хайх</p>
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
                    />
                </div>
            </Fragment>
        )
    }
}
