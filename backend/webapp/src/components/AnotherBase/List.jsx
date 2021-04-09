import React, { Component } from "react"
import {service} from './service'
import { PortalDataTable } from "@utils/DataTable"
import Modal from "../Modal"
import Loader from "@utils/Loader"

export default class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            жагсаалтын_холбоос: '/back/another-database/all/',
            талбарууд: [
                {'field': 'name', "title": 'Нэр'},
                {'field': 'definition', "title": 'Тайлбар'},
                {'field': 'unique_id', "title": 'Таних талбар'},
                {'field': 'db_type', "title": 'Дата бааз төрөл'},
                {'field': 'database_updated_at', "title": 'Сүүлд шинэчилсэн'},
                {'field': 'created_at', "title": 'Үүссэн'},
                {'field': 'updated_at', "title": 'Зассан'},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-table text-success',
                    "action": (values) => this.tableGoLink(values),
                },
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
                {
                    "title": 'Бааз шинэчлэх',
                    "text": '',
                    "icon": 'fa fa-car text-danger',
                    "action": (values) => this.handleRefreshData(values),
                }
            ],
            is_loading: false,
            refresh: true,
            modal_status: "closed",
            values: {}
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.goLink = this.goLink.bind(this)
        this.tableGoLink = this.tableGoLink.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleRefreshData = this.handleRefreshData.bind(this)
        this.handleMssql = this.handleMssql.bind(this)
        this.handleMongo = this.handleMongo.bind(this)

    }

    handleRefreshData(values){
        if(values.db_type == 'MSSQL') this.handleMssql(values)
        else if(values.db_type == "MONGODB") this.handleMongo(values)
    }

    handleMssql(values){
        service
            .mssql_config
            .refreshData(values.id)
            .then(({success}) => {
                if (success) {
                    // this.setState({refresh: !this.state.refresh})
                    // this.handleModalClose()
                }
            })
    }

    handleMongo(values){
        this.setState({is_loading: true})
        service.update(values.id).then(({success}) => {
            if (success) {
                this.setState({is_loading: false})
                alert("Амжилттай")
            }
        })
    }


    set_active_color(boolean){
        let color = "text-danger fa fa-times"
        if(boolean) color = "text-success fa fa-check"
        return color
    }

    tableGoLink(values){
        if(values.db_type == 'MSSQL') this.props.history.push(`/back/another-base/connection/mssql/${values.id}/tables/`)
        else if (values.db_type == 'MONGODB') this.props.history.push(`/back/another-base/connection/mongo/${values.id}/list/`)
    }

    goLink(values){
        if(values.db_type == 'MSSQL') this.props.history.push(`/back/another-base/connection/mssql/${values.id}/`)
        else if (values.db_type == 'MONGODB') this.props.history.push(`/back/another-base/connection/mongo/${values.id}/`)
    }

    handleRemove() {
        const {values} = this.state
        service.remove(values.id).then(({success}) => {
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
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, values, modal_status, is_loading } = this.state
        return (
            <div className="row">
                <Loader
                    is_loading={is_loading}
                    text={'Уншиж байна'}
                />
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <PortalDataTable
                                талбарууд={талбарууд}
                                жагсаалтын_холбоос={жагсаалтын_холбоос}
                                уншиж_байх_үед_зурвас={"Уншиж байна"}
                                хувьсах_талбарууд={хувьсах_талбарууд}
                                нэмэлт_талбарууд={нэмэлт_талбарууд}
                                нэмэх_товч={'/back/another-base/connection/'}
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
