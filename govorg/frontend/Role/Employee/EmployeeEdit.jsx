import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../../components/helpers/ModalAlert';
import { service } from './service'
import InsPerms from '../Role/GovPerms'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {validationSchema} from './validationSchema'

export class EmployeeEdit extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.emp_perms=[]
        this.state = {
            form_values: {
                id: null,
                first_name: '',
                last_name: '',
                email: '',
                position: '',
                is_admin: false,
            },
            role_name: '',
            role_list: [],
            emp_role_id: null,
            perms: {},
            roles: {},

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

    handleSave(values, { setStatus, setSubmitting, setErrors }) {
        const { role_id, id } = this.state
        this.checkRoleAndPerm()
        service
            .updateEmployee(id, values.first_name, values.last_name, values.email, values.position, values.is_admin, role_id, this.perms, this.remove_perms)
            .then(({ success }) => {
                if(success) {
                    this.setState({ modal_alert_status: 'open'})
                    setStatus('saved')
                    setSubmitting(false)
                    this.modalCloseTime()
                }else{
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
    }

    checkRoleAndPerm() {
        this.role.map((role, idx) => {
            this.emp_perms.map((perm, p_idx) => {
                if(role.property_id == perm.property_id && role.feature_id == perm.feature_id && role.perm_kind == perm.perm_kind) {
                    const found = this.remove_perms.find(element => element == perm.gov_perm_ins_id);
                    if(!found) {
                        this.remove_perms.push(perm.gov_perm_ins_id)
                    }
                }
            })
        })
    }

    modalClose() {
        this.props.history.push(this.state.prefix)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        setTimeout(() => {
            this.props.history.push(this.state.prefix)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    componentDidMount() {
        this.perms = []
        this.role = []
        this.remove_perms = []
        this.emp_perms=[]
        this.getDetail()
        this.getRolesForOption()
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.setState({role_list: roles})
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

    getDetail() {
        const { id } = this.state
        service
            .getDetailEmployee(id)
            .then(({form_values, perms, role_id, role_name, success}) => {
                if(success) {
                this.setState({
                    form_values,
                    perms,
                })
                this.getRole(role_id)
                }
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
    }

    removeItemFromRemoveRoles(is_role_emp_id) {
        this.remove_perms.map((id, idx) => {
            if (id == is_role_emp_id) {
                this.remove_perms.splice(idx, 1)
            }
        })
    }

    render() {
        const { form_values, role_list, perms, prefix, is_inspire_role, role_id, roles } = this.state
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
                        <Formik
                            enableReinitialize
                            initialValues={form_values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSave}
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
                            const has_error = Object.keys(errors).length > 0
                            return (
                                <Form className="row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="last_name">Овог:</label>
                                        <Field
                                            className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                            name='last_name'
                                            id="id_last_name"
                                            type="text"
                                            placeholder="Овог"
                                        />
                                        <ErrorMessage name="last_name" component="div" className="text-danger"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="first_name">Нэр:</label>
                                        <Field
                                            className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                            name='first_name'
                                            id="id_first_name"
                                            type="text"
                                            placeholder="Нэр"
                                        />
                                        <ErrorMessage name="first_name" component="div" className="text-danger"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="email">Цахим хаяг:</label>
                                        <Field
                                            className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                            name='email'
                                            id="id_email"
                                            type="text"
                                            placeholder="E-Mail"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-danger"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="position">Албан тушаал:</label>
                                        <Field
                                            className={'form-control ' + (errors.position ? 'is-invalid' : '')}
                                            name='position'
                                            id="id_position"
                                            type="text"
                                            placeholder="Албан тушаал"
                                        />
                                        <ErrorMessage name="position" component="div" className="text-danger"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <div className="icheck-primary">
                                            <Field
                                                className="ml-2"
                                                name='is_admin'
                                                id="is_admin"
                                                type="checkbox"
                                            />
                                            <ErrorMessage name="is_admin" component="div" className="text-danger"/>
                                            <label htmlFor='is_admin'>&nbsp;Админ</label>
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
                                    <div className="form-group col-3">
                                        <button type="submit" className="btn btn-block gp-btn-primary" disabled={isSubmitting}>
                                            {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                            {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                            {!isSubmitting && 'Нэмэх' }
                                        </button>
                                    </div>
                                    </Form>
                                )}}
                            </Formik>
                        </div>
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
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title="Амжилттай хадгаллаа"
                    model_type_icon="success"
                />
            </div>
        )
    }
}
