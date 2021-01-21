import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import { Formik, Form, Field, ErrorMessage, validateYupSchema} from 'formik'
import {validationSchema} from './validationSchema'
import ModalAlert from "../ModalAlert"
import {service} from "./service"


export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                'name': '',
                'description': ''
            },
            modal_alert_status: "closed",
            title: '',
            icon: '',
            timer: null,

        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }
    handleSubmit(values, {setStatus, setSubmitting, setErrors}) {
        setStatus('checking')
        setSubmitting(true)
        service.createPerm(values).then(({success, errors}) => {
            if(success){
                setStatus('saved')
                setSubmitting(false)
                this.setState({
                    modal_alert_status: "open",
                    title: 'Амжилттай хадгаллаа',
                    icon: 'success'
                })
                this.modalCloseTime()
            } else {
                setSubmitting(false)
                setErrors(errors)
            }
        })

    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.props.history.push(`/back/org-role/`)
        }, 2000)
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.props.history.push(`/back/org-role/`)
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-left">
                        <NavLink to={`/back/org-role/`}>
                            <p className="btn gp-outline-primary">
                                <i className="fa fa-angle-double-left"> Буцах</i>
                            </p>
                        </NavLink>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Formik
                                enableReinitialize
                                initialValues={this.state.values}
                                validationSchema={validationSchema}
                                onSubmit={this.handleSubmit}
                            >
                                {({
                                    errors,
                                    status,
                                    touched,
                                    isSubmitting,
                                    setFieldValue,
                                    handleBlur,
                                    values,
                                    isValid,
                                    dirty,
                                }) => {
                                    const has_error = Object.keys(errors).length > 0
                                    return (
                                        <Form>

                                            <div className="form-group">
                                                <label htmlFor="id_name" >
                                                    Эрхийн нэр:
                                                </label>
                                                <Field
                                                    className={'form-control ' + (errors.name ? 'is-invalid' : '')}
                                                    placeholder="Эрхийн нэр"
                                                    name='name'
                                                    id="id_name"
                                                    type="text"
                                                />

                                                <ErrorMessage name="name" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="id_description" >
                                                    Эрхийн тайлбар:
                                                </label>
                                                <Field
                                                    className={'form-control ' + (errors.description ? 'is-invalid' : '')}
                                                    placeholder="Эрхийн тайлбар"
                                                    name='description'
                                                    id="id_description"
                                                    type="text"
                                                />

                                                <ErrorMessage name="description" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div></div>
                                            <div className="span3">
                                                <div>
                                                    <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                                        {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                        {isSubmitting && ' Шалгаж байна.'}
                                                        {!isSubmitting && 'Хадгалах' }
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title={this.state.title}
                    model_type_icon = {this.state.icon}
                />
            </div>
        )

    }

}
