import React, { Component } from 'react';

import { PortalDataTable } from "@utils/DataTable"

export const makeStateColor = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-primary'
    else if (state == "ТАТГАЛЗСАН") color = 'text-danger'
    else if (state == "ЗӨВШӨӨРСӨН") color = 'text-success'
    return color
}

export const makeKindColor = (kind) => {
    let color
    if (kind == "ҮҮССЭН") color = 'text-success'
    else if (kind == "ЗАССАН") color = 'text-primary'
    else if (kind == "УСТГАСАН") color = 'text-danger'
    return color
}

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
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Шийдвэрлэх',
                    "icon": 'fa fa-check-square-o text-warning',
                    "action": (values) => this.goSuccess(values),
                },
            ],
            хувьсах_талбарууд: [
                {"field": "state", "action": (values) => makeStateColor(values) , "action_type": true},
                {"field": "kind", "action": (values) => makeKindColor(values), "action_type": true},
            ],
        }
        this.goSuccess = this.goSuccess.bind(this)
    }

    goSuccess(values) {
        if (values.state == 'ШИНЭ') {
            this.props.history.push(`/gov/forms/tseg-info/tsegpersonal/tseg-personal/${values.id}/шийдвэрлэх/`)
        } else {
            this.props.history.push(`/gov/forms/tseg-info/tsegpersonal/tseg-personal/${values.id}/харах/`)
        }
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
