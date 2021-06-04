import React, { Component } from "react";
import { PortalDataTable } from '@utils/DataTable/index'
import SolveModal from './solveModal'
import LLCSettings from './sett_comp'

export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else if (state == "ИЛГЭЭСЭН") color = 'text-success'
    return color
}

export const make_kind_color = (kind) => {
    let color
    if (kind == "ШИЙДВЭРЛЭГДСЭН") color = 'text-success'
    else if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-warning'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    return color
}

export const download_data = (values) => {
    return (
        <a
            href={'/media/' + values.values.file_path}
            target="_blank"
        >
        <i className="fa fa-download">&nbsp; Татах</i>
        </a>
    )
}

export class Detail extends Component {
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
                {"field": "state", "action": (values) => make_state_color(values) , "action_type": true},
                {"field": "kind", "action": (values) => make_kind_color(values), "action_type": true},
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
                    'component': (values) => download_data(values)
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
        this.refreshData = this.refreshData.bind(this)
        this.handleDetail = this.handleDetail.bind(this)
    }

    refreshData(){
        this.setState({ refresh: !this.state.refresh })
    }

    handleDetail(values) {
        this.props.history.push(`/gov/llc-request/${values.id}/Дэлгэрэнгүй/`)
    }

    handeUpdateAction(values) {
        this.props.history.push(`/gov/llc-request/${values.id}/configure-bundle/`)
    }

    render() {
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh } = this.state
        return (
            <div className="card">
                <div className="card-body">
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
