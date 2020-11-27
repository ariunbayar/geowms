import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../../components/helpers/ModalAlert';
import { service } from './service'
import InsPerms from '../Role/GovPerms'

export class EmployeeEdit extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.emp_perms=[]
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            position: '',
            is_admin: false,
            role_list: [],
            emp_role_id: null,
            perms: {},
            roles: {},

            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            prefix: '/gov/perm/employee/',
            is_inspire_role: false,
            id: this.props.match.params.id,
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getRole = this.getRole.bind(this)
        this.getValue = this.getValue.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.removeItemFromArray = this.removeItemFromArray.bind(this)
        this.removeItemFromRemoveRoles = this.removeItemFromRemoveRoles.bind(this)
        this.checkRoleAndPerm = this.checkRoleAndPerm.bind(this)
    }

    handleSave() {
        const { first_name, last_name, email, position, is_admin, role_id, id } = this.state
        this.setState({ handleSaveIsLoad: true })
        this.checkRoleAndPerm()
        service
            .updateEmployee(id, first_name, last_name, email, position, is_admin, role_id, this.perms, this.remove_perms)
            .then(({ success }) => {
                if(success) {
                    this.setState({ modal_alert_status: 'open'})
                    this.modalCloseTime()
                }
            })
    }

    checkRoleAndPerm() {
        this.check = false
        this.role.map((role, idx) => {
            this.emp_perms.map((perm, p_idx) => {
                if(role.property_id == perm.property_id && role.feature_id == perm.feature_id && role.perm_kind == perm.perm_kind) {
                    this.remove_perms.map((rem_perm, r_idx) => {
                        if(rem_perm == perm.gov_perm_ins_id) {
                            this.check = true
                        }
                    })
                    if(!this.check) {
                        this.remove_perms.push(perm.gov_perm_ins_id)
                    }
                }
            })
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
        this.perms = []
        this.role = []
        this.remove_perms = []
        this.emp_perms=[]
        this.getRolesForOption()
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.getDetail(roles)
                }
            })
    }

    getRole(role_id) {
        const emp_role_id_parsed = parseInt(role_id)
        this.setState({ is_inspire_role: false, role_id: emp_role_id_parsed })
        if(emp_role_id_parsed) {
        service
            .getRole(emp_role_id_parsed)
            .then(({ success, role_name, role_id, role_description, roles }) => {
                if (success) {
                    this.role = []
                    this.setState({ roles, is_inspire_role: true })
                }
            })
        }
    }

    getDetail(roles) {
        const { id } = this.state
        service
            .getDetailEmployee(id)
            .then(rsp => {
                if(rsp.success) {
                    Object.keys(rsp).map((key) => {
                        if(key !== 'success') {
                            this.setState({ [key]: rsp[key] })
                        }
                    })
                }
                this.setState({ role_list: roles })
                this.getRole(rsp.role_id)
            })
    }


    removeItemFromArray (array, feature_id, property_id, perm_kind, perm_inspire_id, is_emp_perm) {
        array.map((perm, idx) => {
            if(perm.feature_id == feature_id &&
                perm.property_id == property_id &&
                perm.perm_kind == perm_kind)
            {
                if(is_emp_perm) this.remove_perms.push(perm_inspire_id)
                else array.splice(idx, 1)
            }
        })
    }

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id, is_emp_perm) {
        console.log(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id, is_emp_perm);
        if(!checked && this.role.length > 0 && type == null) {
            this.removeItemFromArray(
                this.role,
                feature_id,
                property_id,
                perm_kind,
                is_role_emp_id,
                is_emp_perm
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
        if((checked && !type && !is_emp_perm) ||
            (checked && (type == 'role' || type == "perms"))
        ) {
            const add_role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_ins_id': perm_inspire_id,
                'emp_role_ins_id': is_role_emp_id ? is_role_emp_id : null,
            }
            if (type == 'role') this.role.push(add_role)
            if (type == 'perms') this.emp_perms.push(add_role)
            else this.perms.push(add_role)
        }
        if (is_emp_perm && checked && type == null && this.remove_perms.length > 0) {
            this.removeItemFromRemoveRoles(is_role_emp_id)
        }
        console.log(this.perms);
        console.log(this.remove_perms);
        console.log(this.role);
        console.log(this.emp_perms);
    }

    removeItemFromRemoveRoles(is_role_emp_id) {
        this.remove_perms.map((id, idx) => {
            if (id == is_role_emp_id) {
                this.remove_perms.splice(idx, 1)
            }
        })
    }

    render() {
        const { first_name, last_name, email, position, is_admin, role_list, perms, prefix, is_inspire_role, role_id, roles } = this.state
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
                                    <select
                                        className="form-control"
                                        id="choose_role"
                                        value={role_id || ""}
                                        onChange={(e) => this.getRole(e.target.value)}
                                    >
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