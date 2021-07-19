import React, { Component } from "react";
import { validations } from "./validations"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { service } from '../service'
import Loader from "@utils/Loader"

export default class Password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            old_password: '',
            new_password: '',
            re_new_password: '',
            is_loading: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose=this.modalClose.bind(this)
    }

    handleSubmit(values) {
        this.setState({ is_loading: true })
        if(values.new_password == values.re_new_password) {
            service
                .updatePassword(values.new_password, values.old_password, values.re_new_password)
                .then(({ success, error, msg }) => {
                    if (success) {
                        const modal = {
                            modal_status: "open",
                            modal_icon: "fa fa-check-circle",
                            modal_bg: '',
                            icon_color: 'success',
                            title: msg,
                            has_button: false,
                            actionNameBack: '',
                            actionNameDelete: '',
                            modalAction: null,
                            modalClose: () => this.modalClose()
                        }
                        global.MODAL(modal)
                        this.setState({ is_loading: false })
                    } else {
                        const modal = {
                            modal_status: "open",
                            modal_icon: "fa fa-times-circle",
                            modal_bg: '',
                            icon_color: 'danger',
                            title: error,
                            has_button: false,
                            actionNameBack: '',
                            actionNameDelete: '',
                            modalAction: null,
                            modalClose: null
                        }
                        global.MODAL(modal)
                        this.setState({ is_loading: false })
                    }
                })
        } else {
            const modal = {
                modal_status: "open",
                modal_icon: "fa fa-times-circle",
                modal_bg: '',
                icon_color: 'danger',
                title: "Таарахгүй байна",
                has_button: false,
                actionNameBack: '',
                actionNameDelete: '',
                modalAction: null,
                modalClose: null
            }
            global.MODAL(modal)
            this.setState({ is_loading: false })
        }
    }

    modalClose() {
        window.location.href = "/logout"
    }

    render() {
        const { is_loading } = this.state
        return (
            <div className="card">
                <div className="card-body">
                <Loader
                    is_loading={is_loading}
                    text={'Уншиж байна'}
                />
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
                                        className={"form-control " + (errors.old_password ? "is-invalid" : "")}
                                        id="password"
                                        placeholder="Одоогийн нууц үг оруулах"
                                    />
                                    <ErrorMessage name="old_password" component="div" className="invalid-feedback"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="new_password">Шинэ нууц үг:</label>
                                    <Field
                                        name="new_password"
                                        type="password"
                                        className={"form-control " + (errors.new_password ? "is-invalid" : "")}
                                        id="new_password"
                                        placeholder="Шинэ нууц үг оруулах"
                                    />
                                    <ErrorMessage name="new_password" component="div" className="invalid-feedback"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="re_new_password">Шинэ нууц үг дахин оруулах:</label>
                                    <Field
                                        name="re_new_password"
                                        type="password"
                                        className={"form-control " + (errors.re_new_password ? "is-invalid" : "")}
                                        id="re_new_password"
                                        placeholder="Шинэ нууц үг дахин оруулах"
                                    />
                                    <ErrorMessage name="re_new_password" component="div" className="invalid-feedback"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn gp-btn-primary">
                                    Хадгалах
                                </button>
                            </div>
                        </Form>
                    )}}
                    </Formik>
                </div>
            </div>
        )
    }
}
