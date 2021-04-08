import React, { Component } from "react"
import {service} from '../service'
import { PortalDataTable } from "@utils/DataTable"
import Modal from "../../Modal"

export default class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            жагсаалтын_холбоос: `/back/another-database/mongo/tables/${props.match.params.id}/all/`,
            талбарууд: [
                {'field': 'table_name', "title": 'Нэр'},
                {'field': 'feature_code', "title": 'Feature нэр'},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.goLink(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                },
            ],
            refresh: true,
            modal_status: "closed",
            values: {}
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.goLink = this.goLink.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleMssql = this.handleMssql.bind(this)
        this.handleMongo = this.handleMongo.bind(this)

    }

    handleMssql(values){
        alert("MSSQL")
    }

    handleMongo(values){
        alert("MONGODB")
    }


    set_active_color(boolean){
        let color = "text-danger fa fa-times"
        if(boolean) color = "text-success fa fa-check"
        return color
    }

    goLink(values){
        const {id} = this.state
        this.props.history.push(`/back/another-base/connection/mongo/${id}/insert/${values.id}/`)
    }

    handleRemove() {
        const {values, id} = this.state
        service.mongo_config.tableRemove(id, values.id).then(({success}) => {
            if (success) {
                this.setState({refresh: !this.state.refresh})
                this.handleModalClose()
            }
        })
    }

    handleModalOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalClose(){
        this.setState({modal_status: 'closed'})
    }

    handleRemoveAction(values){
        this.setState({values})
        this.handleModalOpen()
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, values, modal_status, id } = this.state
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <PortalDataTable
                                талбарууд={талбарууд}
                                жагсаалтын_холбоос={жагсаалтын_холбоос}
                                уншиж_байх_үед_зурвас={"Уншиж байна"}
                                хувьсах_талбарууд={хувьсах_талбарууд}
                                нэмэлт_талбарууд={нэмэлт_талбарууд}
                                нэмэх_товч={`/back/another-base/connection/mongo/${id}/insert/`}
                                refresh={refresh}
                            />
                        </div>
                    </div>
                </div>
                <Modal
                    text={`Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                    title={'Тохиргоог устгах'}
                    model_type_icon={'success'}
                    status={modal_status}
                    modalClose={this.handleModalClose}
                    modalAction={this.handleRemove}
                />
            </div>
        )
    }
}
