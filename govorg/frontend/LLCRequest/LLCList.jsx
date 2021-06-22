import React, { Component } from "react";
import { PortalDataTable } from '@utils/DataTable/index'
import SolveModal from './solveModal'
import Modal from '@utils/Modal/Modal'
import { service } from "./service"

export const makeStateColor = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-success'
    else if (state == "ИЛГЭЭСЭН") color = 'text-warning'
    else if (state == "ШИЙДВЭРЛЭГДСЭН") color = 'text-primary'
    return color
}

export const makeKindColor = (kind) => {
    let color
    if (kind == "ШИЙДВЭРЛЭГДСЭН") color = 'text-success'
    else if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-warning'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    else if (kind == "ШИНЭ") color = 'text-primary'
    return color
}

export const downloadData = (values) => {
    return (
        <a
            href={values.values.file_path}
            target="_blank"
        >
            <i className="fa fa-download">&nbsp; Татах</i>
        </a>
    )
}

export class GetDescription extends Component {
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
                    values.description
                    &&
                        <a
                            className="btn btn-primary btn-sm text-white text-capitalize"
                            onClick={() => this.props.desModal(values)}
                        >
                            Тайлбар
                        </a>
                }
            </div>
        )
    }
}

function ModalText(props) {
    return (
        <div className="text-center border border-warning rounded p-4 my-2">
            {props.description}
        </div>
    )
}

export class LLCList extends Component {
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
            refresh: false,
            талбарууд: [
                {'field': 'name', "title": 'Нэр'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
                // {'field': 'file_path', "title": 'Хавсаргасан файл'},
                {'field': 'updated_at', "title": 'Зассан'},
            ],
            жагсаалтын_холбоос: '/gov/api/llc-request/',
            хувьсах_талбарууд: [
                {"field": "state", "action": (values) => makeStateColor(values) , "action_type": true},
                {"field": "kind", "action": (values) => makeKindColor(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'дэлгэрэнгүй',
                    "text": '',
                    "icon": 'fa fa-eye text-primary',
                    "action": (values) => this.handleDetail(values),
                },
                {
                    "title": 'Тохиргоо',
                    "text": '',
                    "icon": 'fa fa-cog text-primary',
                    "action": (values) => this.handeUpdateAction(values)
                },
                {
                    "title": 'Хавсаргасан файл',
                    "text": 'Татах',
                    "icon": 'text-primary',
                    'component': (values) => downloadData(values)
                },
                {
                    "title": 'Шийдвэрлэх',
                    'component': SolveModal,
                    'props': {
                        'refreshData': () => this.refreshData(),
                    }
                },
                {
                    "title": 'Тайлбар',
                    'component': GetDescription,
                    'props': {
                        'desModal': (values) => this.desModal(values),
                    }
                }
            ],
            is_modal_request_open: false,
            custom_query: {},
            modal_status: 'closed',
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.refreshData = this.refreshData.bind(this)
        this.desModal = this.desModal.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.handleDetail = this.handleDetail.bind(this)
    }

    componentDidMount() {
        service
            .getChoices()
            .then(({ success, search_field }) =>{
                if (success){
                    this.setState({ choices: search_field })
                }
            })
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

    refreshData() {
        this.setState({ refresh: !this.state.refresh })
    }

    handleDetail(values) {
        this.props.history.push(`/gov/llc-request/${values.id}/Дэлгэрэнгүй/`)
    }

    handeUpdateAction(values) {
        this.props.history.push(`/gov/llc-request/${values.id}/configure-bundle/`)
    }

    modalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(title, text, has_button, description) {
        this.setState({
            title: title,
            text: text,
            has_button: has_button,
            description: description,
        })
        this.modalOpen()
    }

    desModal(values) {
        this.modalChange(
            'ТАЙЛБАР',
            ModalText,
            false,
            values.description,
        )
    }

    render() {
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, choices } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="">Төлөв</label>
                            <select
                                className="form-control form-control-xs"
                                onChange={(e) => this.handleSearch(e, 'state')}
                            >
                                <option value="">--- Төлвөөр хайх ---</option>
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
                            <select
                                className="form-control form-control-xs"
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
                    <div className="row">
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
                <Modal
                    modal_status={this.state.modal_status}
                    title={this.state.title}
                    has_button={this.state.has_button}
                    text={this.state.text}
                    description={this.state.description}
                />
            </div>
        );
    }
}
