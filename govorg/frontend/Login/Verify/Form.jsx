import React, { Component } from "react"
import { validations } from "./validations"
import { Formik, Form, Field} from 'formik'
import {service} from "./service"

export class VerifyForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            new_password: '',
            re_new_password: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(values, {setStatus, setSubmitting}) {
        service.logIn(values.new_password, values.re_new_password).then(success=> {console.log(success)})
        // console.log(values)
    }
    render() {
        return (
            <div className="login-container">
                <div className="container">
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
                        <div className="row">
                            <div className="shadow-lg col-xl-4 col-lg-5 col-md-6 col-sm-10 mx-auto form p-4 bg-light" style={{marginTop : '110px'}}>
                                <div className="px-2">
                                    <form action="" className="">
                                        <div className="aaasd py-2 text-center">
                                            <i className="fa fa-user-circle fa-4x gp-text-primary" aria-hidden="true"></i>
                                            <h5 className="login name gp-text-primary mt-3">ХЭРЭГЛЭГЧ БАТАЛГААЖУУЛАХ ХЭСЭГ</h5>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="new_password">Нууц үг</label>
                                            
                                            <input 
                                                type="password" 
                                                className="form-control form-control-sm" 
                                                placeholder="Нууц үг"
                                                id="new_password">
                                            </input>
                                            {/* <ErrorMessage name="new_password" component="span"/> */}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="re_new_password">Нууц үгийг давтан оруулах</label>
                                            <input 
                                                type="password" 
                                                className="form-control form-control-sm" 
                                                placeholder="Нууц үгийг давтан оруулах"
                                                id="re_new_password">
                                            </input>
                                            {/* <ErrorMessage name="re_new_password" component="span"/> */}
                                        </div>
                                        <button type="button" className="btn gp-btn-primary" 
                                        // onClick={this.props.history.push( `/gov/admin/login/`)}
                                        >Баталгаажуулах</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}}
                    </Formik>
                </div>
            </div>
        )
    }

}
