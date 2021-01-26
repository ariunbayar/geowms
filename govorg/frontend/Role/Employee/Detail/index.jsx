import React, { Component } from "react"

import { service } from "../service"
import InsPerms from '../../Role/GovPerms'
import { ButtonBack } from "./ButtonBack"
import { ButtonTokenRefresh } from "./ButtonTokenRefresh"
import { ButtonEdit } from "./ButtonEdit"
import { ButtonDelete } from "./ButtonDelete"


export class Detail extends Component {

    constructor(props) {
        super(props)

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

            prefix: '/gov/perm/employee/',

            role_id: this.props.match.params.id,
            perms: {},
            role_name: '',
            roles: {},
            is_inspire_role: false,

            status_token_refresh: 'initial',
            status_delete: 'initial',
        }

        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this)
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

    handleTokenRefresh() {
        this.setState({ status_token_refresh: 'loading' })
        service
            .empTokenRefresh(this.state.employee.id)
            .then(({ success, info }) => {
                if(success)
                    this.getDetail()
                this.setState({
                    status_token_refresh: success ? 'success' : 'fail',
                    info_token_refresh: info
                })
            })
    }

    handleDelete() {
        this.setState({ status_delete: 'loading' })
        const id = this.state.employee.id
        service
            .deleteEmployee(id)
            .then(({ success }) => {
                this.setState({ status_delete: success ? 'success' : 'fail' })
            })
    }

    handleDeleteSuccess() {
        this.props.history.push(`${this.state.prefix}`)
    }

    render() {

        const { id } = this.props.match.params
        const { prefix, roles, is_inspire_role, perms, role_name} = this.state
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

        const {
            status_token_refresh,
            status_delete,
            info_token_refresh,
        } = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="container-fluid">

                        <div className="row">
                            <div className="col-md-6 p-0">
                                <ButtonBack to={prefix}/>
                            </div>

                            <div className="col-md-6 p-0 text-right">

                                <ButtonTokenRefresh
                                    onClick={ this.handleTokenRefresh }
                                    status={ status_token_refresh }
                                    status_info={ info_token_refresh }
                                />
                                <ButtonEdit to={`${prefix}${id}/edit/`}/>
                                <ButtonDelete
                                    status={ status_delete }
                                    onClick={ this.handleDelete }
                                    employee_name={ first_name }
                                    onSuccess={ this.handleDeleteSuccess }
                                />
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

                                    <dt className="col-md-3">Эрх:</dt>
                                    <dd className="col-md-9">
                                        { role_name }
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
                    <div>
                        {
                            roles !== {} && is_inspire_role
                            ?
                                <InsPerms
                                    action_type="viewable"
                                    is_employee={true}
                                    dontDid={true}
                                    org_roles={roles}
                                    emp_perms={perms}
                                />
                            : null
                        }
                    </div>
                </div>
            </div>
        )
    }

}
