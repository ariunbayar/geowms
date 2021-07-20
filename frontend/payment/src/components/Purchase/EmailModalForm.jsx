import React, {Component, Fragment} from "react"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'

import { service } from '../service'

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(({ value }) => `Зөв e-mail хаяг оруулна уу.`)
        .max(254, '254-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна e-mail хаяг оруулна уу.'),
})

export default class EmailModalForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initial_values: {
                email: '',
            },
        }
        this.handleProceed = this.handleProceed.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleProceed(values, { setStatus, setSubmitting, setErrors }) {
        service
            .setEmail(values.email)
            .then(({ success, info, errors }) => {
                if (success) {
                    setStatus('saved')
                    setSubmitting(false)
                    this.handleClose()
                }
                else {
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
    }

    handleClose() {
        const modal = { modal_status: 'closed' }
        global.MODAL(modal)
    }

    render () {
        const { initial_values } = this.state
        return (
            <Fragment>
                <Formik
                    initialValues={initial_values}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={this.handleProceed}
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
                                <div className="d-flex justify-content-center">
                                    <h5>Таны e-mail хаяг хоосон байна.</h5>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="id_email">Бүртгүүлэх e-mail хаяг оруулна уу</label>
                                    <Field
                                        name="email"
                                        id="id_email"
                                        type="text"
                                        className="form-control"
                                    />
                                    <ErrorMessage className="text-danger" name="email" component="span"/>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-primary waves-effect waves-light" onClick={this.handleClose}>
                                        <i className="fa fa-times"></i>
                                        {"  БУЦАХ"}
                                    </button>
                                    <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || Object.keys(errors).length > 0}>
                                        {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                        {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                        {!isSubmitting && <i className="fa fa-check-square-o">Үргэлжлүүлэх</i>}
                                    </button>
                                </div>
                            </Form>
                            )
                        }}
                    </Formik>
            </Fragment>
        )
    }
}
