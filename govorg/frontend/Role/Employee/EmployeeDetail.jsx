import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../../components/helpers/ModalAlert';
import { service } from './service'
import InsPerms from '../Role/GovPerms'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {validationSchema} from '../../../../backend/webapp/src/components/Org/OrgUser/validationSchema'


export class EmployeeDetail extends Component {

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
            role_id: this.props.match.params.id,
            old_role_id: null,
            is_inspire_role: false,
            prefix: '/gov/perm/employee/',
            id: this.props.match.params.id,
            role_list: [],
            modal_alert_status: "closed",
            timer: null,
            model_type_icon: '',
            title: '',
            disabled: true,
            role_name: '',
        }
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getValue = this.getValue.bind(this)
        this.removeItemFromArray = this.removeItemFromArray.bind(this)
        this.removeItemFromRemoveRoles = this.removeItemFromRemoveRoles.bind(this)
        this.checkRoleAndPerm = this.checkRoleAndPerm.bind(this)
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
                        perms,
                        role_id,
                        old_role_id: role_id,
                        role_name,
                        form_values:{
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
                }
                this.getRolesForOption()
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

    getRolesForOption() {
        console.log('yeah');
        // service
        //     .getRoleList()
        //     .then(({ success, roles }) => {
        //         if (success) {
        //             console.log(roles);
        //             this.setState({ role_list: roles })
        //             this.getRole(this.state.role_id)
        //         }
        //     })
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

    modalCloseTime() {
        setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(this.state.prefix)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    modalClose() {
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(this.state.prefix)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    render() {
        const {form_values, roles, role_list, prefix, is_inspire_role, perms, old_role_id, role_id, role_name } = this.state
        const { org_roles } = this.props

        return (
            <div className="card">
                <div className="card-body"></div>
                    <div className="col-12">
                        <div className="col-4">
                            <div className="row justify-content-between">
                                <div className="col-6 pl-0">
                                    <NavLink to={`${prefix}`}>
                                        <p className="btn gp-outline-primary">
                                            <i className="fa fa-angle-double-left"></i> Буцах
                                        </p>
                                    </NavLink>
                                </div>
                                <div className="col-6 text-right">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle gp-outline-primary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Dropdown button
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#" ><i className="fa fa-pencil-square-o text-primary mr-2"></i>Засах</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#"><i className="fa fa-pencil-square-o text-primary mr-2"></i>Role</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#"><i className="fa fa-trash-o text-danger    mr-2"></i>Устгах</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Formik
                            enableReinitialize
                            initialValues={form_values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
                            const has_error = Object.keys(errors).length > 0
                            return (
                                <Form>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="id_name" >Нэвтрэх нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.username ? 'is-invalid' : '')}
                                                        name='username'
                                                        id="id_username"
                                                        type="text"
                                                        placeholder="Нэвтрэх нэр"
                                                        disabled={this.state.disabled}
                                                    />
                                                    <ErrorMessage name="username" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="first_name">Овог:</label>
                                                <Field
                                                    className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                                    name='last_name'
                                                    id="id_last_name"
                                                    type="text"
                                                    placeholder="Овог"
                                                    disabled={this.state.disabled}
                                                />
                                                <ErrorMessage name="last_name" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="first_name">Нэр:</label>
                                                <Field
                                                    className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                                    name='first_name'
                                                    id="id_first_name"
                                                    type="text"
                                                    placeholder="Нэр"
                                                    disabled={this.state.disabled}
                                                />
                                                <ErrorMessage name="first_name" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="position">Албан тушаал:</label>
                                                <Field
                                                    className={'form-control ' + (errors.position ? 'is-invalid' : '')}
                                                    name='position'
                                                    id="id_position"
                                                    type="text"
                                                    placeholder="Албан тушаал"
                                                    disabled={this.state.disabled}
                                                />
                                                <ErrorMessage name="position" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="email">Цахим хаяг:</label>
                                                <Field
                                                    className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                                    name='email'
                                                    id="id_email"
                                                    type="text"
                                                    placeholder="Цахим хаяг"
                                                    disabled={this.state.disabled}
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="gender">Хүйс:</label>
                                                <Fragment>
                                                    <Field name="gender" as="select" className="form-control"
                                                        className={'form-control ' + (errors.gender ? 'is-invalid' : '')} disabled={this.state.disabled}>
                                                        <option>Эрэгтэй</option>
                                                        <option>Эмэгтэй</option>
                                                    </Field>
                                                    <ErrorMessage name="gender" component="div" className="text-dange"/>
                                                </Fragment>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="register">Регистер:</label>
                                                <Field
                                                    className={'form-control ' + (errors.register ? 'is-invalid' : '')}
                                                    name='register'
                                                    id="id_register"
                                                    type="text"
                                                    placeholder="Регистер"
                                                    disabled={this.state.disabled}
                                                />
                                                <ErrorMessage name="register" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-4 pl-0">
                                            <label htmlFor="role">Role:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="role"
                                                disabled
                                                value={role_name || ''}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 pl-0">
                                            <label>Админ эсэх:</label>
                                            &nbsp;
                                            &nbsp;
                                            &nbsp;
                                            <i className={`fa ` +
                                                (form_values.is_admin
                                                    ? `fa-check-circle-o text-success`
                                                    : `fa-times-circle-o text-danger`
                                                ) +
                                                    ` fa-lg`
                                                }
                                                aria-hidden="true"
                                            ></i>
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
                                        {this.state.disabled === false &&
                                            <div className="form-group">
                                                <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
                                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                    {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                    {!isSubmitting && 'Хадгалах' }
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </Form>
                            )}}
                        </Formik>
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
