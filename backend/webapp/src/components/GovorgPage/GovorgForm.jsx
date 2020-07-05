import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {TextField} from '@/helpers/forms'
import {service} from "./service"
import {validationSchema} from './validationSchema'

export class GovorgForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            values: {
                name: '',
            },
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }


    handleSubmit(values, { setStatus, setSubmitting }) {

            const data = {
                ...values
            }

            setStatus('checking')
            setSubmitting(true)

            service.create(data).then(({success}) => {
                setTimeout(() => {
                    setStatus('saved')
                    setSubmitting(false)
                    this.props.history.push( '/back/байгууллага/')
                }, 800)
            })
        }

    render() {
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <a href="#" className="btn btn-outline-primary" onClick={this.props.history.goBack}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </a>
                    </div>
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
                                        <TextField
                                            label="Байгууллагын нэр:"
                                            name="name"
                                            error={errors.name}
                                            placeholder="байгууллагын нэр"
                                        />

                                        <div></div>
                                        <div className="span3">
                                            {has_error
                                                ?
                                                    <p> </p>
                                                : status == 'saved' && !dirty &&
                                                    <p>
                                                        Амжилттай нэмэгдлээ
                                                    </p>
                                            }
                                            <div>
                                                <button type="submit" className="btn gp-bg-primary" disabled={isSubmitting || has_error}>
                                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                    {isSubmitting && ' Шалгаж байна.'}
                                                    {!isSubmitting && 'Нэмэх' }
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                    <div className="col-md-8">
                    </div>
                </div>
            </div>

        )
    }
}

