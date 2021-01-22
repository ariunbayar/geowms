import React, { Component, Fragment } from "react"
import {NavLink} from "react-router-dom"

import { service } from "./service"
import Modal from "../../components/helpers/Modal"
import { Notif } from "@utils/Notification"


export class EmployeeDetail extends Component {

    constructor(props) {
        super(props)

        this.too = 0;
        this.state = {
            employee: {
                id: '',
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                gender: '',
                register: '',
                position: '',
                is_admin: false,
                is_super: false,
            },

            role_id: this.props.match.params.id,

            modal_status: 'closed',
            action_type: '',
            text: '',
            title: "",
            action_name: "",

            prefix: '/gov/perm/employee/',
        }
        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
        this.handleModalActionOpen = this.handleModalActionOpen.bind(this)
        this.handleModalActionClose = this.handleModalActionClose.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
        this.modalAction = this.modalAction.bind(this)
    }

    componentDidMount(){
        this.getDetail()
    }

    getDetail() {
        const { role_id } = this.state
        service
            .getDetailEmployee(role_id)
            .then(({employee_detail, perms, role_name, role_id, success}) => {
                if(success) {
                    this.setState({
                        employee: employee_detail,
                        perms,
                        role_name,
                    })
                }
                this.getRole(role_id)
            })
    }

    getRole(id) {
        if (id) {
            service
            .getRole(id)
            .then(({success, roles}) => {
                if(success) {
                    this.setState({ roles, is_inspire_role: true })
                }
            })
        }
    }

    handleModalActionOpen(action_type, text, title, action_name){
        this.setState({modal_status: 'open', action_type, text, title, action_name})

    }

    handleModalActionClose() {
        this.setState({modal_status: 'closed'})
    }

    modalAction(){
        if(this.state.action_type == 'refresh_token') this.handleTokenRefresh()
        else if (this.state.action_type == 'remove') this.handleRemove()
        this.handleModalActionClose()
    }

    handleTokenRefresh() {
        service
            .empTokenRefresh(this.state.employee.id)
            .then(({ success, info }) => {
                if(success) {
                    this.addNotif('success', info, 'check')
                    this.getDetail()
                }
                else {
                    this.addNotif('danger', info, 'times')
                }
                this.setState({modal_status: 'closed'})
            })
    }

    handleRemove() {
        const id = this.state.employee.id
        service
            .deleteEmployee(id)
            .then(({ success }) => {
                if(success) {
                    this.addNotif('success', 'Амжилттай устгалаа', 'check')
                    setTimeout(() => {
                        this.props.history.push(this.state.prefix)
                    }, 2000);
                }
            })
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style, msg, icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    render() {

        const { level, id } = this.props.match.params
        const prefix = '/gov/perm/employee/'
        const {
            username,
            last_name,
            first_name,
            position,
            email,
            gender,
            register,
            is_admin,
            is_active,
            token,
            created_at,
            updated_at,
        } = this.state.employee

        return (
            <div className="card">
                <div className="card-body"></div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6 pl-1">
                                <NavLink
                                    to={prefix}
                                    className="btn gp-outline-primary m-1"
                                >
                                    <i className="fa fa-angle-double-left"></i>
                                    Буцах
                                </NavLink>
                            </div>

                            <div className="col-md-6 p-0 text-right pr-2">
                                <a href="#" className="btn btn-primary waves-effect waves-light m-1"
                                    onClick={() => this.handleModalActionOpen(
                                        'refresh_token',
                                        `Та "${first_name}" нэртэй хэрэглэгчийн токенийг шинэчлэхдээ итгэлтэй байна уу?`,
                                        "Тохиргоог шинэчлэх",
                                        "ШИНЭЧЛЭХ"
                                    )}>
                                    <i className="fa fa-refresh mr-1"></i>Токен шинэчлэх
                                </a>
                                <a href={`${prefix}${id}/edit/`} className="btn btn-primary waves-effect waves-light m-1">
                                    <i className="fa fa-pencil-square-o mr-1"></i>Засах
                                </a>
                                <a href="#" className="btn btn-danger waves-effect waves-light m-1"
                                    onClick={() => this.handleModalActionOpen(
                                        'remove',
                                        `Та "${first_name}" нэртэй хэрэглэгчийг устгахдаа итгэлтэй байна уу?`,
                                        "Хэрэглэгч устгах"
                                        )}>
                                    <i className="fa fa fa-trash-o mr-1"></i>Устгах
                                </a>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <dl className="row">
                                    <dt className="col-md-3">Нэвтрэх нэр:</dt>
                                    <dd className="col-md-9">{ username }</dd>

                                    <dt className="col-md-3">Овог, нэр:</dt>
                                    <dd className="col-md-9">
                                        { last_name }, { first_name }
                                    </dd>

                                    <dt className="col-md-3">Албан тушаал:</dt>
                                    <dd className="col-md-9">
                                        { position }
                                    </dd>

                                    <dt className="col-md-3">Токен:</dt>
                                    <dd className="col-md-9">
                                        { token }
                                    </dd>

                                </dl>
                                <dl className="row">
                                    <dt className="col-md-3">Бүртгэсэн:</dt>
                                    <dd className="col-md-9">
                                        { created_at }
                                    </dd>

                                    <dt className="col-md-3">Зассан:</dt>
                                    <dd className="col-md-9">
                                        { updated_at }
                                    </dd>

                                </dl>
                            </div>

                            <div className="col-md-6">
                                <dl className="row">
                                    <dt className="col-md-3">Мэйл хаяг:</dt>
                                    <dd className="col-md-9">
                                        { email }
                                    </dd>

                                    <dt className="col-md-3">Хүйс:</dt>
                                    <dd className="col-md-9">
                                        { gender }
                                    </dd>

                                    <dt className="col-md-3">Регистр:</dt>
                                    <dd className="col-md-9">
                                        { register }
                                    </dd>
                                </dl>
                                { is_admin &&
                                    <p>
                                        <i className="fa fa-check-circle-o fa-lg" aria-hidden="true"></i>
                                        {} Байгууллагын админ
                                    </p>
                                }

                                { !is_active &&
                                    <p>
                                        <i className="fa fa-times-circle text-danger fa-lg" aria-hidden="true"></i>
                                        {} Нэвтрэх эрхгүй
                                    </p>
                                }
                            </div>

                        </div>

                    </div>

                <Modal
                    modalClose={this.handleModalActionClose}
                    modalAction={this.modalAction}
                    status={this.state.modal_status}
                    text={this.state.text}
                    title={this.state.title}
                    model_type_icon = "success"
                    actionNameDelete={this.state.action_name}
                />
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                </div>
        )
    }

}
