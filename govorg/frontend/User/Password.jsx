import React, { Component } from "react";
import { validations } from "./validations"
import { Formik, Form, Field, ErrorMessage} from 'formik'
// import ModalAlert from "../../ModalAlert"

export class Password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            old_password: '',
            new_password: '',
            re_new_password: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(values, {setStatus, setSubmitting}) {
        service.updatePassword(values.new_password, values.old_password).then(success=> {console.log(success)})
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">
                <Formik
                    enableReinitialize
                    initialValues={this.state}
                    onSubmit={this.handleSubmit}
                    validationSchema={validations}
                >
                {({
                    errors,
                }) => {
                    const has_error = Object.keys(errors).length > 0
                    return (
                        <Form>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="password">Хуучин нууц үг:</label>
                                    <Field
                                        name="old_password"
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Одоогийн нууц үг оруулах"
                                    />
                                    <ErrorMessage name="old_password" component="span"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="re_password">Шинэ нууц үг:</label>
                                    <Field
                                        name="new_password"
                                        type="password"
                                        className="form-control"
                                        id="new_password"
                                        placeholder="Шинэ нууц үг оруулах"
                                    />
                                    <ErrorMessage name="new_password" component="span"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="re_new_password">Шинэ нууц үг дахин оруулах:</label>
                                    <Field
                                        name="re_new_password"
                                        type="password"
                                        className="form-control"
                                        id="re_new_password"
                                        placeholder="Шинэ нууц үг дахин оруулах"
                                    />
                                    <ErrorMessage name="re_new_password" component="span"/>
                                </div>
                            </div>
                            <button type="submit" className="btn gp-btn-primary">Хадгалах</button>
                        </Form>
                    )}}
                    </Formik>
                </div>
            </div>
        )
    }
}