import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import { Formik, Form, Field, ErrorMessage, validateYupSchema} from 'formik'
import {validationSchema} from './validationSchema'
import Modal from "@utils/Modal/Modal"
import {service} from "./service"


export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                'name': '',
                'description': ''
            },
            modal_status: 'closed',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)

    }
    handleSubmit(values, {setStatus, setSubmitting, setErrors}) {
        setStatus('checking')
        setSubmitting(true)

        service.createPerm(values).then(({success, errors}) => {
            if(success){
                setStatus('saved')
                setSubmitting(false)
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    'success',
                    'Амжилттай хадгаллаа',
                    '',
                    false,
                    '',
                    '',
                    null,
                    () => this.props.history.push(`/back/org-role/`)
                )
            } else {
                setSubmitting(false)
                setErrors(errors)
            }
        })

    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction=null, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
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
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
            </div>
        )

    }

}
