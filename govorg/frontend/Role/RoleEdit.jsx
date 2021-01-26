import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'

import { service } from "./Role/service";
import ModalAlert from "@utils/Modal/ModalAlert"
import InsPerms from './Role/GovPerms'

const validationSchema = Yup.object().shape({
    role_name: Yup.string()
        .required('Нэр оруулна уу !'),
})


export class RoleEdit extends Component {

    constructor(props) {
        super(props)
        this.perms=[]
        this.remove_perms=[]
        this.role=[]
        this.state = {
            initial_values:{
                role_name: '',
                role_description: '',
            },
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            is_continue: false,
            gov_perm_id: this.props.org_roles.gov_perm_id,
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.getAllValue = this.getAllValue.bind(this)
        this.getValue = this.getValue.bind(this)
        this.getRoleDetail = this.getRoleDetail.bind(this)
        this.removeItemFromRemoveRoles = this.removeItemFromRemoveRoles.bind(this)
    }

    handleSave(values, { setStatus, setSubmitting, setErrors}) {
        const {gov_perm_id } = this.state
        const id = this.props.match.params.id
        this.setState({ handleSaveIsLoad: true })
        service
            .updateRole(id, gov_perm_id, values.role_name, values.role_description, this.remove_perms, this.perms)
            .then(({success, errors}) => {
                if (success) {
                    this.setState({modal_alert_status: "open"})
                    setStatus('saved')
                    setSubmitting(false)
                    this.modalCloseTime()
                }else{
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
    }

    modalClose() {
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(`/gov/perm/role/`)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(`/gov/perm/role/`)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
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
            this.removeItemFromRemoveRoles(is_role_emp_id)
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
                'gov_perm_inspire_id': perm_inspire_id,
            }
            if (type == 'role') this.role.push(add_role)
            else this.perms.push(add_role)
        }
        if (is_true_type && checked && type == null && this.remove_perms.length > 0) {
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

    componentDidMount() {
        this.getRoleDetail()
    }

    getRoleDetail() {
        this.setState({ is_continue: false })
        service
            .detailRole(this.props.match.params.id)
            .then(({ success, role_id, role_name, role_description, roles }) => {
                if (success) {
                    this.setState({ role_id, roles, is_continue: true, initial_values:{
                        role_name, role_description,
                    }
                    })
                }
            })
    }

    render() {
        const { is_continue, initial_values, roles} = this.state
        const { org_roles } = this.props
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-left">
                        <NavLink to={`/gov/perm/role`}>
                            <p className="btn gp-outline-primary">
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </p>
                        </NavLink>
                    </div>
                    <Formik
                        initialValues={ initial_values }
                        enableReinitialize
                        validationSchema={ validationSchema }
                        onSubmit={ this.handleSave}
                    >
                        {({
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            setFieldValue,
                            setStatus,
                            setValues,
                            handleBlur,
                            values,
                            isValid,
                            dirty,
                        }) => {
                            return (
                                <Form>
                                    <div className="row">

                                        <div className="form-group col-md-12">
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="role_name" >Эрхийн нэр:</label>
                                                        <Field
                                                            name="role_name"
                                                            id="id_role_name"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage className="text-danger" name="role_name" component="span"/>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="role_description" >Эрхийн тайлбар:</label>
                                                    <Field
                                                        name="role_description"
                                                        id="id_role_description"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage className="text-danger" name="role_description" component="span"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div>
                                        {
                                            is_continue &&
                                            <InsPerms
                                            action_type="editable"
                                            getValue={this.getValue}
                                            sendAllValue={this.getAllValue}
                                            dontDid={true}
                                            org_roles={org_roles}
                                            role={roles}
                                            addable_is_check={this.perms}
                                            />
                                        }
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || Object.keys(errors).length >0}>
                                            {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                            {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                            {!isSubmitting && 'Хадгалах' }
                                        </button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title="Амжилттай хадгаллаа"
                    model_type_icon = "success"
                />
            </div>
        )
    }

}
