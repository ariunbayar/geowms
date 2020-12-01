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
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose=this.modalClose.bind(this)
    }

    handleSubmit(values) {
        this.setState({handleSubmitIsLoad:true})
        service.updatePassword(values.new_password, values.old_password).then(({ success }) => {
            success && this.setState({modal_alert_status: "open"})
        })
        this.modalCloseTime()
    }

    modalClose(){
        this.setState({handleSubmitIsLoad:false})
        this.props.history.push( `/gov/profile/`)
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
                                                title="Амжилттай хадгаллаа"
                                                model_type_icon = "success"
                                            />
                                        </>
                                        :
                                        <button className="btn gp-btn-primary" onClick={this.handleSubmitIsLoad} >
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