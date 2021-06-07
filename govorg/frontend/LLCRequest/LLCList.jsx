import React, { Component } from "react";
import { PortalDataTable } from '@utils/DataTable/index'
import SolveModal from './solveModal'
import { service } from "./service"

export const makeStateColor = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else if (state == "ИЛГЭЭСЭН") color = 'text-success'
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
            href={'/media/' + values.values.file_path}
            target="_blank"
        >
            <i className="fa fa-download">&nbsp; Татах</i>
        </a>
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
                }
            ],
            is_modal_request_open: false,
            custom_query: {}
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.refreshData = this.refreshData.bind(this)
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

    handleSearch(e) {
        let custom_query = Object()
        var value = parseInt(e.target.value)

        var table_data = e.target.selectedIndex
        var optionElement = e.target.childNodes[table_data]
        var selected_data_name =  optionElement.getAttribute('name')

        if (selected_data_name == 'state') {
            if (e.target.value) custom_query['state'] = value
        }
        this.setState({ custom_query, [selected_data_name]: value })
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

    render() {
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, choices } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="col-md-6 row mb-3">
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
            </div>
        );
    }
}
