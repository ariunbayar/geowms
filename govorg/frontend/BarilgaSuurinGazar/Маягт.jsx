import React, { Component } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Modal from "../../../src/components/Modal/DeleteModal"
import { validationSchema } from './validationSchema'
import { service } from "./service"

export default class Маягт extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.oid,
            is_modal_delete_open: false,
            data: {
                fields: [],
                rows: [],
            },
        }

    }

    componentDidMount() {

        service
            .rows(this.state.id)
            .then(({ data }) => {
                this.setState({ data })
        })

    }

    render() {
        const { fields } = this.state.data
        return (
            <div>
                <Formik
                        enableReinitialize
                        initialValues={this.state.values}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmit}
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
                                    <div className="form-group" key={ idx }>
                                        <label className="">{ field }</label>
                                        <input className="form-control" placeholder={ field } />
                                    </div>
                                )}

                                <div>
                                    <button type="submit" className="btn" disabled={isSubmitting || has_error}>
                                        {isSubmitting && <i className="fas fa-spinner fa-pulse"></i>}
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
