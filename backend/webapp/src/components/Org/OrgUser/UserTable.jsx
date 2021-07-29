import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"
import Modal from '@utils/Modal/Modal'
import { service } from '../service'
import Loader from "@utils/Loader"

function GetPassword(values) {
    const user_detail = values.values
    return(
          <div className='p-0'>
            {
                user_detail.is_user
                &&
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => values.getPass(values.values)}
                    >
                        НУУЦ ҮГ СОЛИХ
                    </button>
            }
          </div>
        )
    }

export class UserTable extends Component {

    constructor(props) {

        super(props)

        this.state = {
            refresh: false,
            жагсаалтын_холбоос: `/back/api/org/level-${props.match.params.level}/${props.match.params.id}/employeeList/`,
            нэмэх_товч: `/back/байгууллага/түвшин/${props.match.params.level}/${props.match.params.id}/хэрэглэгч/нэмэх/`,
            custom_query: {"user__is_user": true},
            modal_status: 'closed',
            талбарууд: [
                {'field': 'user__first_name', "title": 'Нэр', 'has_action': true},
                {'field': 'user__email', "title": 'Цахим шуудан'},
                {'field': 'position', "title": 'Албан тушаал'},
                {'field': 'role_name', "title": 'Role', "is_sort": true},
                {'field': 'user_state', "title": 'Төлөв', 'has_action': true},
                {'field': 'is_admin', "title": 'Админ', 'has_action': true, "is_center": true},
                {'field': 'created_at', "title": 'Үүссэн'},
                {'field': 'updated_at', "title": 'Зассан'},
            ],
            хувьсах_талбарууд: [
                {"field": "user__first_name", "action": (values) => this.go_link(values)},
                {"field": "user__email",  "text": ""},
                {"field": "position",  "text": ""},
                {"field": "user_state",  "action": this.setStateColor, "action_type": true},
                {"field": "is_admin",  "action": (values) => this.set_icon(values) , "action_type": true, "is_center": true},
                {"field": "created_at",  "text": ""},
                {"field": "updated_at",  "text": ""},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": '',
                    'component': (values) => GetPassword(values),
                    'props': {
                        'getPass': (values) => this.getPass(values),
                    }
                }
            ],
            is_user: true,
            is_loading: false,
            text: '',
            drop_name: 'Хэрэглэгч',
        }
        this.getPass = this.getPass.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.handleListChange = this.handleListChange.bind(this)
        this.handleSendMail = this.handleSendMail.bind(this)
    }

    handleSendMail() {
        this.setState({ is_loading: true, text: 'Нууц үг солих имэйл илгээгдэж байна. Түр хүлээнэ үү!' })
        const { values } = this.state

        service
            .sendMail(values.id)
            .then(({ success, info }) => {
                if(success) {
                    this.setState({ is_loading: false, text: '' })
                    this.modalChange(
                        'fa fa-check-circle',
                        null,
                        "success",
                        info,
                        false,
                        '',
                        '',
                        null,
                        null
                    )
                }
            })
    }

    modalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.modalOpen()
        )
    }

    getPass(values) {
        this.setState({ values })
        this.modalChange(
            'fa fa-exclamation-circle',
            null,
            'warning',
            `Нууц үг солих имэйл илгээхдээ итгэлтэй байна уу?`,
            true,
            '',
            'Тийм',
            (values) => this.handleSendMail(values),
            null
        )
    }

    set_icon(value) {
        var icon
        if (value) {icon = "fa fa-check-circle-o text-success fa-lg"}
        else {icon = "fa fa-times-circle-o text-danger fa-lg"}

        return icon
    }

    go_link(values) {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${values.id}/дэлгэрэнгүй/`)
    }

    setStateColor(user_state){
        var color
        if(user_state == 'Ажиллаж байгаа'){
            color = "text-success"
        }
        else if(user_state == 'Чөлөөтэй'){
            color = "text-secondary"
        }
        else if(user_state == 'Чөлөөлөгдсөн'){
            color = "text-danger"
        } else {
            color = "text-warning"
        }
        return color

    }

    handleListChange(drop_name, custom_query) {
        this.setState({ drop_name, custom_query })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            нэмэлт_талбарууд,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
        } = this.state
        return (
            <div className="card">
                <div className="card-body">
                <Loader is_loading={this.state.is_loading} text={this.state.text}/>
                    <div className="d-flex flex-row-reverse mb-2">
                        <div className="dropdown-menu-right show">
                            <a className="btn-sm dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.drop_name}
                            </a>

                            <div className="dropdown-menu mr-2" aria-labelledby="dropdownMenuLink">
                                <button className="dropdown-item" onClick={() => this.handleListChange('Хэрэглэгч', {'user__is_user': true})}>Хэрэглэгч</button>
                                <button className="dropdown-item" onClick={() => this.handleListChange('Бүх ажилчид', {})}>Бүх ажилчид</button>
                                <button className="dropdown-item" onClick={() => this.handleListChange('Чөлөөлөгдсөн ажилчид', {'state':3})}>Чөлөөлөгдсөн ажилчид</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэх_товч={нэмэх_товч}
                            custom_query={custom_query}
                        />
                    </div>
                </div>
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
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
