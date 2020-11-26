import React, { Component } from "react"
import { validations } from "./validations"
import { Formik} from 'formik'
import {service} from "./service"


export class Log extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(values, {setStatus, setSubmitting}) {
        service.logIn(values.email, values.password).then(success=> {console.log(success)})
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
                                            <h5 className="login name gp-text-primary mt-3">НЭВТРЭХ ХЭСЭГ</h5>
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="email">Имэйл хаяг</label>
                                            <input type="text" className="form-control form-control-sm" placeholder="Имэйл хаяг" id="email"></input>
                                            {/* <ErrorMessage name="email" component="span"/> */}
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="password">Нууц үг</label>
                                            <input type="password" className="form-control form-control-sm" placeholder="Нууц үг" id="password"></input>
                                            {/* <ErrorMessage name="email" component="span"/> */}
                                        </div>
                                        <button type="submit" className="btn gp-btn-primary">Нэвтрэх</button>
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
