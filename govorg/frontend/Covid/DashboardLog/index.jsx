import React, { Component } from 'react';
import { PortalDataTable } from "@utils/DataTable"
import { service } from '../service';

class Log extends Component {

    constructor(props) {
        super(props);
        this.state = {
            жагсаалтын_холбоос: `/gov/dahsb-list/${props.geo_id}/`,
            талбарууд: [
                {'field': 'name', "title": 'Нэр'},
                {'field': 'batlagdsan_tohioldol_too', "title": 'Батлагдсан тохиолдол'},
                {'field': 'edgersen_humuus_too', "title": 'Эдгэрсэн хүмүүсийн тоо'},
                {'field': 'nas_barsan_hunii_too', "title": "Нас барсан хүмүүсийн тоо"},
                {'field': 'shinjilgee_hiisen_too',"title": "Шинжилгээ хийсэн тоо"},
                {'field': 'updated_at', "title": 'Огноо'},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                }
            ],
            refresh: true,
        }
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
    }

    handleRemoveAction(values) {
        service
            .removeDashBoard(values.id)
            .then(({ success, info }) => {
                alert(info)
                this.setState({ refresh: !this.state.refresh })
            })
            .catch(() => {
                alert("Алдаа гарсан байна")
            })
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, values, modal_status } = this.state

        return (
            <div className="card-body pt-0">
                <PortalDataTable
                    color={'primary'}
                    талбарууд={талбарууд}
                    жагсаалтын_холбоос={жагсаалтын_холбоос}
                    уншиж_байх_үед_зурвас={"Уншиж байна"}
                    хувьсах_талбарууд={хувьсах_талбарууд}
                    нэмэлт_талбарууд={нэмэлт_талбарууд}
                    нэмэх_товч={'/gov/covid-dashboard-config/log-create/'}
                    refresh={refresh}
                    хайлт={'closed'}
                />
            </div>
        );
    }
}

export default Log;