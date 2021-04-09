import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
    EMAIL_USE_TLS: Yup.string(),
    EMAIL_HOST: Yup.string(),
    EMAIL_HOST_NAME: Yup.string(),
    EMAIL_HOST_USER: Yup.string(),
    EMAIL_HOST_PASSWORD: Yup.string(),
    EMAIL_PORT: Yup.string()
})


export default class ConfigEmail extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                system_local_base_url:'',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        service.config.email.get().then((values) => {
            this.setState({
                initial_values: values,
                values,
            })
        })
    }

    handleEdit(e) {
        e.preventDefault()

        const { is_editing } = this.state

        this.setState({
            is_editing: !is_editing,
        })
    }

    handleSubmit(values, { setStatus, setValues }) {

        setStatus('saving')

        service.config.email
            .save(values)
            .then(({ success }) => {

                if (success) {
                    setStatus('save_success')
                    this.setState({ values })
                } else {
                    return Promise.reject()
                }

            })
            .catch(() => {
                setValues(this.state.values)
                setStatus('save_error')
            })
            .finally(() => {
                this.setState({ is_editing: false })
            })

    }

    render() {

        const {
            is_editing,
            initial_values,
        } = this.state

        return (
            <div className="card">

                <div className="card-header">
                    Мэйлийн тохиргоо
                    <div className="card-action">
                        <a href="#" onClick={ this.handleEdit }>
                            <i className="fa fa-edit"></i>
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    <Formik
                        initialValues={ initial_values }
                        initialStatus={ 'initial' }
                        enableReinitialize
                        validationSchema={ validationSchema }
                        onSubmit={ this.handleSubmit }
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
                                    <fieldset disabled={ !is_editing }>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="EMAIL_USE_TLS">EMAIL USE TLS</label>
                                                <Field
                                                    name="EMAIL_USE_TLS"
                                                    id="EMAIL_USE_TLS"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="EMAIL_HOST_NAME">EMAIL HOST NAME</label>
                                                <Field
                                                    name="EMAIL_HOST_NAME"
                                                    id="EMAIL_HOST_NAME"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="EMAIL_HOST">EMAIL HOST</label>
                                                <Field
                                                    name="EMAIL_HOST"
                                                    id="EMAIL_HOST"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="EMAIL_PORT">EMAIL PORT</label>
                                                <Field
                                                    name="EMAIL_PORT"
                                                    id="EMAIL_PORT"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="EMAIL_HOST_USER">EMAIL HOST USER</label>
                                                <Field
                                                    name="EMAIL_HOST_USER"
                                                    id="EMAIL_HOST_USER"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="EMAIL_HOST_PASSWORD">EMAIL HOST PASSWORD</label>
                                                <Field
                                                    name="EMAIL_HOST_PASSWORD"
                                                    id="EMAIL_HOST_PASSWORD"
                                                    type="password"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        { is_editing &&
                                            <button
                                                type="submit"
                                                className="btn gp-btn-primary"
                                                disabled={ status == 'saving' }
                                            >
                                                {status == 'saving' &&
                                                    <Fragment>
                                                        <i className="fa fa-circle-o-notch fa-spin"></i> {}
                                                        Түр хүлээнэ үү...
                                                    </Fragment>
                                                }
                                                {status != 'saving' && 'Хадгалах' }
                                            </button>
                                        }
                                    </fieldset>
                                    { !is_editing && status == 'save_success' &&
                                        <div className="alert alert-icon-success alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-success">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Амжилттай хадгаллаа!</span>
                                            </div>
                                        </div>
                                    }
                                    { !is_editing && status == 'save_error' &&
                                        <div className="alert alert-icon-warning alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-warning">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Хадгалахад алдаа гарлаа!</span>
                                            </div>
                                        </div>
                                    }
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        )
    }
}
