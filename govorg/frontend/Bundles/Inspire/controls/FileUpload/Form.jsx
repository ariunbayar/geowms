import React, { Component } from 'react'
import {Field, ErrorMessage, Formik, Form} from 'formik'

export class FormDetail extends Component {


    constructor(props){
        super(props)
        this.state = {
            btn_is_laod: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(values, {setErrors}) {
        this.props.sendSubmit(values, setErrors)
    }

    render() {
        const { values } = this.props
        return (
            <Formik
                initialValues={ values }
                enableReinitialize
                onSubmit={this.handleSubmit}
            >
                {({
                    errors,
                    setErrors,
                    values,
                }) => {
                    return(
                        <Form className="form-row">
                            <div className="form-group col-lg-12">
                                <label htmlFor="order_no">Тушаалын дугаар:</label>
                                <Field
                                    className={'form-control ' + (errors.order_no ? 'is-invalid' : '')}
                                    name='order_no'
                                    id="order_no"
                                    type="text"
                                    placeholder="Тушаалын дугаар"
                                />
                                <ErrorMessage name="order_no" component="div" className="invalid-feedback"/>
                            </div>
                            <div className="form-group col-lg-12">
                                <label htmlFor="order_at">Тушаал гарсан огноо:</label>
                                <Field
                                    className={'form-control ' + (errors.order_at ? 'is-invalid' : '')}
                                    name='order_at'
                                    id="order_at"
                                    type="date"
                                    placeholder="Тушаал гарсан огноо"
                                />
                                <ErrorMessage name="order_at" component="div" className="invalid-feedback"/>
                            </div>
                            <button
                                className="btn gp-btn-primary"
                                type="submit"
                            >
                                Файл илгээх
                            </button>
                        </Form>
                    )
                }}
            </Formik>
        )
    }
}
