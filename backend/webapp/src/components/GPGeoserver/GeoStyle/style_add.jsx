import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {Switch, Route, NavLink} from "react-router-dom"


export class CreateStyle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                style_name: '',
            },
            range_number: 1
        }
    }

    render() {
            const {
                form_values,
                range_number
            } = this.state
            return (
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-12">
                            <Formik
                                enableReinitialize
                                initialValues={
                                    form_values
                                }
                                // validationSchema={validationSchema}
                                onSubmit={this.handleSubmit}
                            >
                            {({
                                errors,
                                isSubmitting,
                            }) => {
                                return (
                                    <Form>
                                        <div className="form-row col-md-8">
                                            <div className="form-row text-dark">
                                                <div className="form-row col-md-8 mb-2">
                                                    <label htmlFor="image_format" className="col-md-4 my-2">Style-ийн нэр</label>
                                                    <Field
                                                            name='image_format'
                                                            id='image_format'
                                                            type="text"
                                                            className="form-control col-md-6"
                                                        >
                                                    </Field>
                                                </div>
                                                <div className="form-row col-md-8 mb-2">
                                                    <label htmlFor="image_format" className="col-md-4 my-2">Style-ийн гарчиг</label>
                                                    <Field
                                                            name='image_format'
                                                            id='image_format'
                                                            type="text"
                                                            className="form-control col-md-6 mt-2"
                                                        >
                                                    </Field>
                                                </div>
                                                <div className="form-row col-md-8 mb-2">
                                                    <label htmlFor="image_format" className="col-md-4 my-2">Range-ийн тоо</label>
                                                    <input
                                                        className="form-control col-1 mt-2"
                                                        onChange={(e) => this.setState({ range_number: e.target.value })}
                                                        value={range_number}
                                                        />
                                                </div>
                                                <select
                                                    className="form-control form-control-sm"
                                                >
                                                {
                                                        (() => {
                                                            const rows = [];
                                                            for (let i = 1; i <= range_number; i++) {
                                                            rows.push(<option key={i} className="col-md-12">{i}</option>);
                                                            }
                                                            return rows;
                                                        })()
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </Form>
                                    )}}
                            </Formik>
                        </div>
                    </div>
                    {/* <ModalAlert
                        modalAction={() => this.modalClose()}
                        status={modal_alert_status}
                        title={model_alert_text}
                        model_type_icon={model_alert_icon}
                    /> */}
                </div>
            )

        }
    }
