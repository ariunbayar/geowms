import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'

import { service } from './Role/service'
import Modal from "@utils/Modal/Modal"
import InsPerms from './Role/GovPerms'
import BackButton from "@utils/Button/BackButton"


const validationSchema = Yup.object().shape({
    role_name: Yup.string()
        .required('Нэр оруулна уу !'),
})


export class RoleAdd extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.state = {
            initial_values:{
                role_name: '',
                role_description: '',
            },
            edit: false,
            handleSaveIsLoad: false,
            modal_status: "closed",
            is_continue: false,
            gov_perm_id: this.props.org_roles.gov_perm_id
        }
        this.handleSave = this.handleSave.bind(this)
        this.getValue = this.getValue.bind(this)
        this.getAllValue = this.getAllValue.bind(this)
        this.removeItemFromArray = this.removeItemFromArray.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleSave(values, { setStatus, setSubmitting, setErrors }) {
        const {gov_perm_id } = this.state
        service.createRole(gov_perm_id, values.role_name, values.role_description, this.perms).then(({success, errors}) => {
            if (success) {
                this.setState({ handleSaveIsLoad: false })
                this.handleModalOpen()
                setStatus('saved')
                setSubmitting(false)
            } else {
                setErrors(errors)
                setSubmitting(false)
            }
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handleUserSearch(field, e) {
        this.setState({ [field]: e.target.value })
    }

    removeItemFromArray (array, feature_id, property_id, perm_kind, is_role_emp_id, is_true_type) {
        array.map((perm, idx) => {
            if(perm.feature_id == feature_id &&
                perm.property_id == property_id &&
                perm.perm_kind == perm_kind)
            {
                array.splice(idx, 1)
            }
        })
    }

    getAllValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id) {
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

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id) {
        if(!checked && this.perms.length > 0) {
            this.removeItemFromArray(
                this.perms,
                feature_id,
                property_id,
                perm_kind,
            )
        }
        if(checked) {
            const role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_inspire_id': perm_inspire_id,
            }
            this.perms.push(role)
        }
    }

    render() {
        const {initial_values} = this.state
        const { org_roles } = this.props
        return (
            <div className="card">
                <div className="card-body">
                    <BackButton {...this.props} name={'Буцах'} navlink_url={'/gov/perm/role'}></BackButton>
                    <Formik
                        initialValues={initial_values}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={this.handleSave}
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
                                                    <label htmlFor="role_name">Role нэр:</label>
                                                        <Field
                                                            name="role_name"
                                                            id="id_role_name"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage className="text-danger" name="role_name" component="span"/>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="role_description">Role тайлбар:</label>
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
                                        <InsPerms
                                            action_type="addable"
                                            getValue={this.getValue}
                                            sendAllValue={this.getAllValue}
                                            dontDid={true}
                                            org_roles={org_roles}
                                            addable_is_check={this.perms}
                                        />
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
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon='fa fa-check-circle'
                    icon_color='success'
                    title='Амжилттай хадгаллаа'
                    text=''
                    has_button={false}
                    modalAction={null}
                    modalClose={() => this.props.history.push(`/gov/perm/role/`)}
                />
            </div>
        )
    }
}
