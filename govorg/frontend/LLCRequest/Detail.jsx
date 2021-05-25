import React, { Component } from "react";
import { PortalDataTable } from '@utils/DataTable/index'
import OpenMapModal from './openMapModal'
import { service } from "./service"


export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else if (state == "ИЛГЭЭСЭН") color = 'text-success'
    return color
}

export const make_kind_color = (kind) => {
    let color
    if (kind == "ШИЙДВЭРЛЭГДСЭН") color = 'text-success'
    else if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-primary'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    return color
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
                // {'field': 'theme_name', "title": 'Орон зайн өгөгдөл', 'has_action': true},
                {'field': 'org', "title": 'Байгууллага'},
                {'field': 'project', "title": 'Төсөл'},
                {'field': 'file', "title": 'File'},
                {'field': 'created_at', "title": 'Огноо'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
            ],
            жагсаалтын_холбоос: '/gov/api/llc-request/',
            хувьсах_талбарууд: [
                {"field": "state", "action": (values) => make_state_color(values) , "action_type": true},
                {"field": "kind", "action": (values) => make_kind_color(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [{
                "title": 'Шийдвэрлэх',
                'component': OpenMapModal,
                'props': {
                    'refreshData': () => this.refreshData(),
                },
            }],
            is_modal_request_open: false,
            custom_query: {}
        }

    }

    componentDidMount() {
        service
            .getChoices()
            .then(({success, modules, choices}) => {
                if (success) {
                    this.setState({ modules, choices })
                }
            })
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
