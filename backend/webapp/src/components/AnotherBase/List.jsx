import React, { Component } from "react"
import {service} from './service'
import { PortalDataTable } from "@utils/DataTable"
import Modal from "@utils/Modal/Modal"
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
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleRefreshData = this.handleRefreshData.bind(this)
        this.handleMssql = this.handleMssql.bind(this)
        this.handleMongo = this.handleMongo.bind(this)
        this.modalChange = this.modalChange.bind(this)

    }

    handleRefreshData(values){
        if(values.db_type == 'MSSQL') this.handleMssql(values)
        else if(values.db_type == "MONGODB") this.handleMongo(values)
    }

    handleMssql(values){
        this.setState({is_loading: true})
        service
            .mssql_config
            .refreshData(values.id)
            .then(({success}) => {
                if (success) {
                    this.setState({is_loading: false})
                    this.modalChange(
                        'fa fa-check-circle',
                        null,
                        'success',
                        'Амжилттай боллоо',
                        ``,
                        false,
                        '',
                        '',
                        null,
                        null
                    )
                }
            })
            .catch(() => {
                this.setState({is_loading: false})
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    'danger',
                    'Алдаа гарсан байна',
                    ``,
                    false,
                    '',
                    '',
                    null,
                    null
                )
            })
    }

    handleMongo(values){
        this.setState({is_loading: true})
        service.update(values.id).then(({success, all_count, success_count, prop_b_count}) => {
            if (success) {
                this.setState({is_loading: false})
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    'success',
                    'Амжилттай',
                    `Нийт ${all_count} мөр дата, insert хийгдэх мөр ${prop_b_count} эндээс амжилттай орсон нь ${success_count}`,
                    false,
                    '',
                    '',
                    null,
                    null
                )
            }else{
                this.setState({is_loading: false})
                this.modalChange(
                    'fa fa-times-circle',
                    null,
                    'danger',
                    'Алдаа гарлаа',
                    `Мэдээлэл дутуу байна.`,
                    false,
                    '',
                    '',
                    null,
                    null
                )
            }

        }).catch(() => {
            this.setState({is_loading: false})
            this.modalChange(
                'fa fa-check-circle',
                null,
                'danger',
                'Алдаа гарсан байна',
                ``,
                false,
                '',
                '',
                null,
                null
            )
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
                this.setState(
                    {refresh: !this.state.refresh},
                    () => {
                        this.modalChange(
                            'fa fa-check-circle',
                            null,
                            'success',
                            'Амжилттай устгалаа',
                            '',
                            false,
                            '',
                            '',
                            null,
                            null
                        )
                    }
                )
            }
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handleRemoveAction(values){
        this.setState({values})
        this.modalChange(
            'fa fa-exclamation-circle',
            null,
            'warning',
            'Тохиргоог устгах',
            `Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
            true,
            '',
            '',
            (values) => this.handleRemove(values),
            null
        )
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
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
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    text={ this.state.text }
                    title={ this.state.title }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
            </div>
        )
    }
}
