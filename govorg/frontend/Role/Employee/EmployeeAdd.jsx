import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../../components/helpers/ModalAlert';
import { service } from './service'
import InsPerms from '../Role/GovPerms'
export class EmployeeAdd extends Component {

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
            role_list: [],
            emp_role_id: null,
            roles: {},

            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            prefix: '/gov/perm/employee/',
            is_inspire_role: false
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getRole = this.getRole.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    handleSave() {
        const { first_name, last_name, email, position, is_admin, emp_role_id } = this.state
        this.setState({ handleSaveIsLoad: true })
        console.log(this.perms);
        service
            .createEmployee(first_name, last_name, email, position, is_admin, emp_role_id, this.perms)
            .then(({ success }) => {
                if(success) {
                    this.setState({ modal_alert_status: 'open'})
                    this.modalCloseTime()
                }
            })
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
        this.getRolesForOption()
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.setState({ role_list: roles })
                }
            })
    }

    getRole(emp_role_id) {
        const emp_role_id_parsed = parseInt(emp_role_id)
        this.setState({ is_inspire_role: false, emp_role_id: emp_role_id_parsed })
        if(emp_role_id_parsed) {
        service
            .getRole(emp_role_id_parsed)
            .then(({ success, role_name, role_id, role_description, roles }) => {
                if (success) {
                    console.log(roles);
                    this.setState({ roles, is_inspire_role: true })
                }
            })
        }
    }

    removeItemFromArray (array, feature_id, property_id, perm_kind, is_role_emp_id, is_true_type) {
        array.map((perm, idx) => {
            if(perm.feature_id == feature_id &&
                perm.property_id == property_id &&
                perm.perm_kind == perm_kind)
            {
                if(is_true_type) this.remove_perms.push(is_role_emp_id)
                else array.splice(idx, 1)
            }
        })
    }

    getAllValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id) {
        if(checked && type == "all" && is_role_emp_id && this.remove_perms.length > 0) {
            this.removeItemFromRemoveRoles()
        }
        if(!checked && type == 'all' && is_role_emp_id && this.role.length > 0) {
            this.removeItemFromArray(
                this.role,
                feature_id,
                property_id,
                perm_kind,
                is_role_emp_id,
                is_true_type
            )
        }
        if(checked && type == "all" && !is_role_emp_id) {
            const add_role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_inspire_id': perm_inspire_id,
            }
            this.perms.push(add_role)
        }
        if(!checked && type == "all" && !is_role_emp_id && this.perms.length > 0) {
            this.removeItemFromArray(
                this.perms,
                feature_id,
                property_id,
                perm_kind,
            )
        }
    }

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id) {
        if(!checked && is_true_type && this.role.length > 0 && type == null) {
            this.removeItemFromArray(
                this.role,
                feature_id,
                property_id,
                perm_kind,
                is_role_emp_id,
                is_true_type
            )
        }
        if(!checked && this.perms.length > 0) {
            this.removeItemFromArray(
                this.perms,
                feature_id,
                property_id,
                perm_kind,
            )
        }
        if((checked && !type && !is_true_type) ||
            (checked && (type == 'role'))
        ) {
            const add_role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_ins_id': perm_inspire_id,
                'emp_role_ins_id': is_role_emp_id ? is_role_emp_id : null,
            }
            if (type == 'role') this.role.push(add_role)
            else this.perms.push(add_role)
        }
        if (is_true_type && checked && type == null && this.remove_perms.length > 0) {
            this.removeItemFromRemoveRoles()
        }
    }

    removeItemFromRemoveRoles() {
        this.remove_perms.map((id, idx) => {
            if (id == is_role_emp_id) {
                this.remove_perms.splice(idx, 1)
            }
        })
    }

    render() {
        const { first_name, last_name, email, position, is_admin, role_list, roles, prefix, is_inspire_role } = this.state
        const { org_roles } = this.props
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
                                        onChange={(e) => this.setState({ first_name: e.target.value })}
                                        value={first_name}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="last_name">Нэр:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        placeholder="Нэр"
                                        onChange={(e) => this.setState({ last_name: e.target.value })}
                                        value={last_name}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="email">Цахим хаяг:</label>
                                    <input
                                        type="mail"
                                        className="form-control"
                                        placeholder="Цахим хаяг"
                                        id="email"
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                        value={email}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="position">Албан тушаал:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Албан тушаал"
                                        id="position"
                                        onChange={(e) => this.setState({ position: e.target.value })}
                                        value={position}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <div className="icheck-primary">
                                        <input
                                            type="checkbox"
                                            id="is_admin"
                                            checked={is_admin}
                                            onChange={(e) => this.setState({ is_admin: e.target.checked })}
                                        />
                                        <label htmlFor="is_admin">&nbsp;Админ</label>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <label htmlFor="choose_role">Role: </label>
                                    <select className="form-control" id="choose_role" onChange={(e) => this.getRole(e.target.value)}>
                                        <option value="">--- Role сонгоно уу ---</option>
                                        {role_list.length > 0 && role_list.map((role, idx) =>
                                            <option key={idx} value={role.role_id}>{role.role_name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div className="form-group">
                        {this.state.handleSaveIsLoad ?
                            <>
                                <button className="btn btn-block gp-btn-primary">
                                    <a className="spinner-border text-light" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </a>
                                    <span> Шалгаж байна. </span>
                                </button>
                                <ModalAlert
                                    modalAction={() => this.modalClose()}
                                    status={this.state.modal_alert_status}
                                    title="Амжилттай хадгаллаа"
                                    model_type_icon="success"
                                />
                            </>
                            :
                            <button className="btn btn-block gp-btn-primary" onClick={this.handleSave} >
                                Хадгалах
                            </button>
                        }
                    </div>

                    <br />
                    <div>
                        {
                            roles !== {} && is_inspire_role
                            ?
                                <InsPerms
                                    action_type="editable"
                                    is_employee={true}
                                    getValue={this.getValue}
                                    sendAllValue={this.getAllValue}
                                    dontDid={true}
                                    org_roles={org_roles}
                                    role={roles}
                                />
                            : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}