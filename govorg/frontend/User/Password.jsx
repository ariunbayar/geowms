import React, { Component } from "react";
import { validations } from "./validations"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import {service} from '../service'
import ModalAlert from "../../../backend/webapp/src/components/ModalAlert"

export class Password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            old_password: '',
            new_password: '',
            re_new_password: '',
            handleSubmitIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            msg: '',
            error: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose=this.modalClose.bind(this)
    }

    handleSubmit(values) {
        this.setState({handleSubmitIsLoad:true})
        if(values.new_password == values.re_new_password) {
            service
                .updatePassword(values.new_password, values.old_password, values.re_new_password)
                .then(({ success, error, msg }) => {
                if (success) {
                    this.setState({ msg, modal_alert_status: "open" })
                    this.modalCloseTime()
                } else {
                    this.setState({ error, modal_alert_status: "open" })
                }
            })
        } else {
            this.setState({ error: "Таарахгүй байна", modal_alert_status: "open" })
        }
    }

    modalClose(){
        this.setState({handleSubmitIsLoad:false})
        if (this.state.msg) {
            this.props.history.push( `/gov/profile/`)
        }
        if(this.state.error) {
            this.setState({ error: '' })
        }
        this.setState({modal_alert_status: "closed"})
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({handleSubmitIsLoad:false})
            this.props.history.push( `/gov/profile/`)
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        const { msg, error } = this.state
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
                            <div className="form-group">
                                    {this.state.handleSubmitIsLoad ?
                                        <>
                                            <button className="btn gp-btn-primary">
                                                <a className="spinner-border text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </a>
                                                <span> Шалгаж байна. </span>
                                            </button>
                                            <ModalAlert
                                                modalAction={() => this.modalClose()}
                                                status={this.state.modal_alert_status}
                                                title={msg || error}
                                                model_type_icon = {error !== '' ? "danger" : "success"}
                                            />
                                        </>
                                        :
                                        <button type="submit" className="btn gp-btn-primary">
                                            Хадгалах
                                        </button>
                                    }
                                </div>
                        </Form>
                    )}}
                    </Formik>
                </div>
            </div>
        )
    }
}