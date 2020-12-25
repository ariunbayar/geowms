import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../../components/helpers/ModalAlert';
import { service } from './service'
import InsPerms from '../Role/GovPerms'
export class EmployeeDetail extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.state = {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            gender: '',
            register: '',
            position: '',
            is_admin: false,
            emp_role_id: null,
            perms: {},
            role_name: '',
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            prefix: '/gov/perm/employee/',
            is_inspire_role: false,
            role_id: this.props.match.params.id,
        }
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
    }

    modalClose() {
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(this.state.prefix)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(this.state.prefix)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    componentDidMount() {
        this.getDetail()
    }

    getDetail() {
        const { role_id } = this.state
        service
            .getDetailEmployee(role_id)
            .then(({employee_detail, perms, role_name, role_id, success}) => {
                if(success) {
                    this.setState({
                        username: employee_detail.username,
                        first_name: employee_detail.first_name,
                        last_name: employee_detail.last_name,
                        email: employee_detail.email,
                        position: employee_detail.position,
                        is_admin: employee_detail.is_admin,
                        gender: employee_detail.gender,
                        register: employee_detail.register,
                        role_name,
                        perms,
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

    render() {
        const { username, first_name, last_name, email, gender, register, position, is_admin, perms, prefix, role_name, is_inspire_role, roles } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-left">
                            <NavLink to={`${prefix}`}>
                                <p className="btn gp-outline-primary">
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </p>
                            </NavLink>
                        </div>
                    <div className="row">

                        <div className="form-group col-md-12">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="username">Нэвтрэх нэр:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Овог"
                                        disabled
                                        value={username || ''}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="first_name">Овог:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        placeholder="Овог"
                                        disabled
                                        value={first_name || ''}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="last_name">Нэр:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        placeholder="Нэр"
                                        disabled
                                        value={last_name || ''}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="position">Албан тушаал:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Албан тушаал"
                                        id="position"
                                        disabled
                                        value={position || ''}
                                    />
                                </div>


                                <div className="form-group col-md-6">
                                    <label htmlFor="email">Цахим хаяг:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Цахим хаяг"
                                        id="email"
                                        value={email || ''}
                                        disabled
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="gender">Хүйс:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Хүйс"
                                        id="gender"
                                        value={gender || ''}
                                        disabled
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="role">Role:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="role"
                                        disabled
                                        value={role_name || ''}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="register">Регистер:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Регистер"
                                        id="register"
                                        disabled
                                        value={register || ''}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Админ эсэх:</label>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <i className={`fa ` +
                                        (is_admin
                                            ? `fa-check-circle-o text-success`
                                            : `fa-times-circle-o text-danger`
                                        ) +
                                            ` fa-lg`
                                        }
                                        aria-hidden="true"
                                    ></i>
                                </div>
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
