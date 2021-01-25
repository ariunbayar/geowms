import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"
import {Formik, Field, Form, ErrorMessage} from 'formik'

import { service } from './service'
import ModalAlert from "@utils/Modal/ModalAlert"
import InsPerms from '../Role/GovPerms'
import {validationSchema} from '../../../../backend/webapp/src/components/Org/OrgUser/validationSchema'


export class EmployeeEdit extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.emp_perms=[]
        this.state = {
            form_values: {
                username: '',
                last_name: '',
                first_name: '',
                position: '',
                email: '',
                gender: '',
                register: '',
                is_admin: false,
            },

            roles: {},
            perms: {},
            role_id: '',
            old_role_id: null,
            is_inspire_role: false,
            prefix: '/gov/perm/employee/',
            id: this.props.match.params.id,
            role_list: [],
            modal_alert_status: "closed",
            timer: null,
            model_type_icon: '',
            title: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
        this.getValue = this.getValue.bind(this)
        this.removeItemFromArray = this.removeItemFromArray.bind(this)
        this.removeItemFromRemoveRoles = this.removeItemFromRemoveRoles.bind(this)
        this.checkRoleAndPerm = this.checkRoleAndPerm.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    componentDidMount() {
        this.perms = []
        this.role = []
        this.remove_perms = []
        this.emp_perms=[]

        this.getDetail()
    }

    getDetail() {
        const {id} = this.state
        service
            .getDetailEmployee(id)
            .then(({ success, employee_detail, role_id, perms }) => {
                if (success) {
                    this.setState({ perms, role_id, old_role_id: role_id,  form_values:{
                            username: employee_detail.username,
                            last_name: employee_detail.last_name,
                            first_name: employee_detail.first_name,
                            position: employee_detail.position,
                            email: employee_detail.email,
                            gender: employee_detail.gender,
                            register: employee_detail.register,
                            is_admin: employee_detail.is_admin,
                        }
                    })
                    this.getRolesForOption()
                }
            })
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.setState({ role_list: roles })
                    this.getRole(this.state.role_id)
                }
            })
    }

    getRole(role_id) {
        this.perms = []
        this.emp_perms = []
        this.setState({role_id, is_inspire_role: false })
        if(role_id) {
            service
                .getRole(role_id)
                .then(({ success, roles }) => {
                    if (success) {
                        this.role = []
                        this.setState({ roles, is_inspire_role: true })
                    }
                })
        }
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

    removeItemFromRemoveRoles(is_role_emp_id) {
        this.remove_perms.map((id, idx) => {
            if (id == is_role_emp_id) {
                this.remove_perms.splice(idx, 1)
            }
        })
    }


    handleSubmit(form_values, {setStatus, setSubmitting, setErrors}) {
        const username = form_values.username
        const first_name = form_values.first_name
        const last_name = form_values.last_name
        const position = form_values.position
        const email = form_values.email
        const gender = form_values.gender
        const register = form_values.register
        const is_admin = form_values.is_admin
        const {id, role_id} = this.state

        this.checkRoleAndPerm()
        service
            .updateEmployee(username, first_name, last_name, position, email, gender, register, is_admin, role_id, id, this.perms, this.remove_perms)
            .then(({ success, info }) => {
                if(success) {
                    setStatus('saved')
                    setSubmitting(false)
                    this.setState({model_type_icon: 'success'})
                } else {
                    if (errors) {
                        setErrors(errors)
                    }
                    setSubmitting(false)
                    this.setState({model_type_icon: 'danger'})
                }
                this.setState({ modal_alert_status: 'open', title: info})
                this.modalCloseTime()
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

    render() {
        const {form_values, roles, role_list, prefix, is_inspire_role, perms, old_role_id, role_id, id } = this.state
        const { org_roles } = this.props
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-left">
                        <NavLink to={`${prefix}${id}/detail/#`}>
                            <p className="btn gp-outline-primary">
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </p>
                        </NavLink>
                    </div>
                    <div className="row">
                        <Formik
                            enableReinitialize
                            initialValues = {form_values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
                            const has_error = Object.keys(errors).length > 0
                            return (
                                <Form className="col-12">
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="username" >Нэвтрэх нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.username ? 'is-invalid' : '')}
                                                        name='username'
                                                        id="id_username"
                                                        type="text"
                                                        placeholder="Нэвтрэх нэр"
                                                    />
                                                    <ErrorMessage name="username" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="first_name">Овог:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                                        name='first_name'
                                                        id="id_first_name"
                                                        type="text"
                                                        placeholder="Овог"
                                                    />
                                                    <ErrorMessage name="first_name" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="last_name">Нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                                        name='last_name'
                                                        id="id_last_name"
                                                        type="text"
                                                        placeholder="Нэр"
                                                    />
                                                    <ErrorMessage name="last_name" component="div" className="text-danger"/>
                                                </div>
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
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="email">Цахим хаяг</label>
                                                <Field
                                                    className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                                    name='email'
                                                    id="id_email"
                                                    type="text"
                                                    placeholder="Цахим хаяг"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="gender">Хүйс:</label>
                                                <Fragment>
                                                    <Field name="gender" as="select" className="form-control"
                                                    className={'form-control ' + (errors.gender ? 'is-invalid' : '')}>
                                                        <option>Эрэгтэй</option>
                                                        <option>Эмэгтэй</option>
                                                    </Field>
                                                    <ErrorMessage name="gender" component="div" className="text-dange"/>
                                                </Fragment>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="register">Регистер:</label>
                                                <Field
                                                    className={'form-control ' + (errors.register ? 'is-invalid' : '')}
                                                    name='register'
                                                    id="id_register"
                                                    type="text"
                                                    placeholder="Регистер"
                                                />
                                                <ErrorMessage name="register" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="choose_role">Role: </label>
                                                <select className='form-control' id="choose_role" name='choose_role' value={this.state.role_id} onChange={(e) => this.getRole(e.target.value)}>
                                                    <option value="">--- Role сонгоно уу ---</option>
                                                    {role_list.length > 0 && role_list.map((role, idx) =>
                                                        <option key={idx} value={role.role_id}>{role.role_name}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className="form-group col-md-6">
                                                <label htmlFor='is_admin'>Байгууллагын админ</label>
                                                <Field
                                                    className="ml-2"
                                                    name='is_admin'
                                                    id="id_is_admin"
                                                    type="checkbox"
                                                />
                                                <ErrorMessage name="is_admin" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                roles !== {} && is_inspire_role
                                                ?
                                                    <InsPerms
                                                        action_type="editable"
                                                        is_employee={true}
                                                        getValue={this.getValue}
                                                        dontDid={true}
                                                        org_roles={org_roles}
                                                        role={roles}
                                                        emp_perms={old_role_id == role_id ? perms : null}
                                                        editable_is_check={this.perms}
                                                    />
                                                : null
                                            }
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary btn-block waves-effect waves-light m-1" disabled={isSubmitting}>
                                                {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                {!isSubmitting && 'Хадгалах' }
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}}
                        </Formik>
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status = {this.state.modal_alert_status}
                    title = {this.state.title}
                    model_type_icon = {this.state.model_type_icon}
                />
            </div>
        )
    }
}
