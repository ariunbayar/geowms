import React, { Component } from 'react';

import { PortalDataTable } from "@utils/DataTable"
import InspireMap from '@utils/BundleMap'

class TsegRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: `/back/api/систем/govorgList/${props.match.params.id}/`,
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Системийн нэрүүд', 'has_action': true},
                {'field': 'token', "title": 'Токен'},
                {'field': 'created_at', "title": 'Үүсгэсэн огноо'},
            ],
            нэмэлт_талбарууд: [{
                "title": 'Шийдвэрлэх',
                'component': InspireMap,
                'props': {
                    'refreshData': () => this.refreshData(),
                },
            }],
        }
    }

    componentDidMount() {

    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
            нэмэлт_талбарууд,
        } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <PortalDataTable
                        refresh={refresh}
                        color={'bg-dark'}
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        per_page={20}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэх_товч={нэмэх_товч}
                        custom_query={custom_query}
                        нэмэлт_талбарууд={нэмэлт_талбарууд}
                    />
                </div>
            </div>
        );
    }
}

export default TsegRequest;