import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
})


export default class ConfigValueTypes extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            value_types: [],
            values: {},
            input_types: ['text', 'number', 'date', 'checkbox', 'radio', 'password', 'range', 'url', 'color', 'file']
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        service.config.inspire
            .get_value_type_fields()
            .then(({ success, value_types, initial_values }) => {
                if (success) {
                    this.setState({ value_types, initial_values })
                }
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

        service.config.inspire
            .save_value_types(values)
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
            value_types,
            input_types,
        } = this.state
        return (
            <div className="card">
                <div className="card-header">
                    Inspire Value type ыг формын input болгох тохиргоо
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
                                        {
                                            value_types.map((item, idx) =>
                                                <div className="form-group row" key={idx}>
                                                    <label htmlFor={`id_${item.value_type_id}`} className="col-4 col-form-label">{item.value_type_id}</label>
                                                    <div className="col-8">
                                                    <Field
                                                        as="select"
                                                        className="form-control"
                                                        name={item.value_type_id}
                                                        id={`id_${item.value_type_id}`}
                                                    >
                                                        {
                                                            input_types.map((item, idx) =>
                                                                <option key={idx} value={item}>{item}</option>
                                                            )
                                                        }
                                                    </Field>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            is_editing
                                            &&
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
