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
            first_name: '',
            last_name: '',
            email: '',
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
            .then(({form_values, perms, role_id, role_name, success}) => {
                if(success) {
                    this.setState({
                        first_name: form_values.first_name,
                        last_name: form_values.last_name,
                        email: form_values.email,
                        position: form_values.position,
                        is_admin: form_values.is_admin,
                        perms,
                    })
                }
                this.getRole(role_id)
            })
    }

    getRole(id) {
        service
            .getRole(id)
            .then(({success, roles}) => {
                if(success) {
                    this.setState({ roles, is_inspire_role: true })
                }
            })
    }

    render() {
        const { first_name, last_name, email, position, is_admin, perms, prefix, role_name, is_inspire_role, roles } = this.state
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
                                <div className="form-group col-md-6">
                                    <label htmlFor="role">Role:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Role"
                                        id="role"
                                        disabled
                                        value={role_name || ''}
                                    />
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
