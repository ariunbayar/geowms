import React, { Component } from "react"
import  { Redirect } from 'react-router-dom'
import { Formik, input, ErrorMessage, validateYupSchema , inputArray} from 'formik'

export class Form extends Component {
    render() {
        return (
            <div className="login-container">
                <div className="container">
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
                                            type="text" 
                                            className="form-control form-control-sm" 
                                            placeholder="Нууц үг"
                                            id="new_password">
                                        </input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="re_new_password">Нууц үгийг давтан оруулах</label>
                                        <input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        placeholder="Нууц үгийг давтан оруулах"
                                        id="re_new_password">
                                        </input>
                                    </div>
                                    <button type="submit" className="btn gp-btn-primary">Баталгаажуулах</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
