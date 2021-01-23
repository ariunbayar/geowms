import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"

import { service } from "../service"
import ModalAlert from "../../ModalAlert"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {validationSchema} from './validationSchema'


export class UserAdd extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_values: {
                id: null,
                username: '',
                first_name: '',
                last_name: '',
                position: '',
                email: '',
                gender: 'Эрэгтэй',
                register:'',
                is_admin: false,
                is_super: false,
                re_password_mail: false
            },
            modal_alert_status: "closed",
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    componentDidMount() {
        const org_emp = this.props.match.params.emp
        if(org_emp){
            this.handleGetAll(org_emp)
        }
    }

    handleGetAll(org_emp){
        service.employeeDetail(org_emp).then(({ success, employee }) => {
            if (success) {
                this.setState({form_values: {
                    id: employee.id,
                    username: employee.username,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    gender: employee.gender,
                    register:employee.register,
                    position: employee.position,
                    is_admin: employee.is_admin,
                    is_super:employee.is_super
                }})
            }
        })
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {

        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const org_emp = this.props.match.params.emp
        if(org_emp){
            if(values.re_password !== values.password)
            {
                setErrors({'re_password': 'Нууц үг адил биш байна.'})
                setSubmitting(false)
            }
            else{
                service.employeeUpdate(org_emp, org_level, values).then(({ success, errors }) => {
                    if (success) {
                        this.setState({modal_alert_status: "open"})
                        setStatus('saved')
                        setSubmitting(false)
                        this.modalCloseTime()
                    } else {
                        setErrors(errors)
                        setSubmitting(false)
                    }
                })
            }

        }
        else{
            service.employeeAdd(org_level, org_id, values).then(({ success, errors }) => {
                if (success) {
                    this.setState({modal_alert_status: "open"})
                    setStatus('saved')
                    setSubmitting(false)
                    this.modalCloseTime()
                }
                else{
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
        }
    }

    modalCloseTime(){
        setTimeout(this.modalClose, 2000)
    }

    modalClose(){
        const { level, id, emp } = this.props.match.params
        this.props.history.push(`/back/байгууллага/түвшин/${level}/${id}/хэрэглэгч/${emp}/дэлгэрэнгүй/`)
    }

    render() {
        const {form_values} = this.state
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const org_emp = this.props.match.params.emp

        const url_list = `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`
        const url_detail = `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${org_emp}/дэлгэрэнгүй/`

        return (
            <div className="col-6">
                <div className="row">
                    <div className="col-md-12">
                        <NavLink
                            to={ org_emp ? url_detail : url_list }
                            className="btn gp-outline-primary m-1"
                        >
                            <i className="fa fa-angle-double-left"></i>
                            {} Буцах
                        </NavLink>
                    </div>

                    <div className="col-md-12">
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
                                <Form className="col-12">
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-8">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="id_name" >Нэвтрэх нэр:</label>
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
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="first_name">Овог:</label>
                                                <Field
                                                    className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                                    name='last_name'
                                                    id="id_last_name"
                                                    type="text"
                                                    placeholder="Овог"
                                                />
                                                <ErrorMessage name="last_name" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-4">
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
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-8">
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
                                            <div className="form-group col-md-8">
                                                <label htmlFor="email">E-Mail</label>
                                                <Field
                                                    className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                                    name='email'
                                                    id="id_email"
                                                    type="text"
                                                    placeholder="E-Mail"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-8">
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
                                            <div className="form-group col-md-8">
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
                                        </div>
                                        {org_emp &&
                                        <div className="form-row">
                                           <div className="form-group col-md-8">
                                                <label htmlFor='id_re_password_mail'>Нууц үг солих e-mail илгээх</label>
                                                <Field
                                                    className="ml-2"
                                                    name='re_password_mail'
                                                    id="id_re_password_mail"
                                                    type="checkbox"
                                                />
                                                <ErrorMessage name="re_password_mail" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        }
                                        <div className='form-row'>
                                            <div className="form-group col-md-8">
                                                <label htmlFor='id_is_admin'>Байгууллагын админ</label>
                                                <Field
                                                    className="ml-2"
                                                    name='is_admin'
                                                    id="id_is_admin"
                                                    type="checkbox"
                                                />
                                                <ErrorMessage name="is_admin" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        {org_level ==4 &&
                                            <div className='form-row'>
                                                <div className="form-group col-md-8">
                                                    <label htmlFor='is_super'>Системийн админ</label>
                                                    <Field
                                                        className="ml-2"
                                                        name='is_super'
                                                        id="id_is_super"
                                                        type="checkbox"
                                                    />
                                                    <ErrorMessage name="is_super" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                        }
                                        <div className="form-group">
                                            <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
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
                    status={this.state.modal_alert_status}
                    title="Амжилттай хадгаллаа"
                    model_type_icon = "success"
                />
            </div>
        )
    }
}
