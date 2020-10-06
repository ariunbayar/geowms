import React, { Component } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Modal from "../../../src/components/Modal/DeleteModal"
import { validationSchema } from './validationSchema'
import { service } from "./service"


export default class Маягт extends Component {

    constructor(props) {
        super(props)

        this.state = {
            values: {
                'id': '',
                'f_code': '',
            },
            is_loading: true,
            oid: this.props.match.params.oid,
            data: {
                fields: [],
                rows: [],
            },
        }

        this.onSubmit = this.onSubmit.bind(this)

    }

    onSubmit(values, { setStatus, setSubmitting }) {
        this.setState({ values })
        setStatus('checking')
        setSubmitting(true)

        service
            .save(values)
            .then(({ success }) => {
                if (success) {
                    setStatus('saved')
                    setSubmitting(false)
                }
            })
    }

    componentDidMount() {
        service
            .rows(this.state.oid)
            .then(({ data }) => {
                this.setState({
                    is_loading: false,
                    data,
                })
        })
    }

    render() {

        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }

        const { fields } = this.state.data

        return (
            <div>
                <Formik
                    enableReinitialize
                    initialValues={this.state.values}
                    onSubmit={this.onSubmit}
                    validationSchema={ validationSchema }
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
                                { fields.map((field, idx) =>
                                    <div className="form-group row" key={ idx }>
                                        <label className="col-sm-2 col-form-label">{ field.name }</label>
                                        <div className="col-sm-10">
                                            <Field name={ field.name } className="form-control" placeholder={ field.name } type="text"/>
                                            <ErrorMessage name={ field.name } component="span" className="invalid-feedback"/>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button type="submit" className="btn" disabled={isSubmitting || has_error}>
                                        {isSubmitting && <i className="fa fa-spinner fa-pulse"></i>}
                                        {isSubmitting && 'Шалгаж байна.'}
                                        {!isSubmitting && 'Хадгалах'}
                                    </button>
                                    {has_error
                                        ?
                                        <p>
                                            <i className="far fa-times-circle"></i>
                                            {} Алдаатай утгыг засварлаж ахин оролдоно уу!
                                            </p>
                                        : status == 'saved' && !dirty &&
                                        <p>
                                            <i className="fas fa-check-circle"></i>
                                            {} Амжилттай хадгаллаа
                                            </p>
                                    }
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        )
    }
}
