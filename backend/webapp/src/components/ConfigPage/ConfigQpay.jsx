import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
    id: Yup.string(),
    register_no: Yup.string(),
    name: Yup.string(),
    email: Yup.string(),
    phone_number: Yup.string(),
    note: Yup.string(),
})


export default class ConfigQPay extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                id: '',
                register_no: '',
                name: '',
                email: '',
                phone_number: '',
                note: '',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        service.config.qpay.get().then((values) => {
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

        service.config.qpay
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
                    QPay-р худалдан авалт хийх үеийн хүлээн авагчийн мэдээллийн тохиргоо
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
                            status,
                            setStatus,
                        }) => {
                            return (
                                <Form>
                                    <fieldset disabled={ !is_editing }>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id">id</label>
                                                <Field
                                                    name="id"
                                                    id="id_id"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="register_no">register no</label>
                                                <Field
                                                    name="register_no"
                                                    id="id_register_no"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="name">name</label>
                                                <Field
                                                    name="name"
                                                    id="id_name"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="email">email</label>
                                                <Field
                                                    name="email"
                                                    id="id_email"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="phone_number">phone number</label>
                                                <Field
                                                    name="phone_number"
                                                    id="id_phone_number"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="note">note</label>
                                                <Field
                                                    name="note"
                                                    id="id_note"
                                                    type="text"
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
