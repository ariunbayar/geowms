import React, { Component } from 'react';

import { PortalDataTable } from "@utils/DataTable"

class TsegRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: `/gov/api/tseg-personal/list/`,
            custom_query: {},
            талбарууд: [
                {'field': 'point_name', "title": 'Цэгийн нэр'},
                {'field': 'point_id', "title": 'Цэгийн дугаар'},
                {'field': 'point_class', "title": 'Цэгийн анги'},
                {'field': 'point_type', "title": 'Цэгийн төрөл'},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "icon": 'fa fa-pencil-square-o text-success',
                    "action": (values) => this.goLink(values),
                },
                {
                    "title": 'Шийдвэрлэх',
                    "icon": 'fa fa-check-square-o text-warning',
                    "action": (values) => this.goSuccess(values),
                },
            ],
        }
        this.goLink = this.goLink.bind(this)
        this.goSuccess = this.goSuccess.bind(this)
    }

    goLink(values) {
        this.props.history.push(`/gov/forms/tseg-info/tsegpersonal/tseg-personal/${values.id}/засах/`)
    }

    goSuccess(values) {
        console.log(values);
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
                        нэмэх_товч={'/gov/forms/tseg-info/tsegpersonal/tseg-personal/add/'}
                    />
                </div>
            </div>
        );
    }
}

export default TsegRequest;