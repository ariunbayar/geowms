import React, { Component } from "react"
// import {NavLink} from "react-router-dom"
// import { Formik, Form, Field, ErrorMessage, validateYupSchema} from 'formik'
// import {validationSchema} from './validationSchema'
// import ModalAlert from "../ModalAlert"
// import {service} from "./service"


export class Form extends Component {

    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         values: {
    //             'name': '',
    //             'description': ''
    //         },
    //         modal_alert_status: "closed",
    //         title: '',
    //         icon: ''

    //     }
    //     this.handleSubmit = this.handleSubmit.bind(this)

    // }
    // handleSubmit(values, {setStatus, setSubmitting}) {
    //     setStatus('checking')
    //     setSubmitting(true)
    //     service.createPerm(values).then(({success}) => {
    //         if(success){
    //             setTimeout(() => {
    //                 setStatus('saved')
    //                 setSubmitting(false)
    //                 this.setState({modal_alert_status: "open", title: 'Амжилттай хадгаллаа', icon: 'success'})
    //                 this.modalClose()
    //             }, 800)
    //         }else{
    //             setTimeout(() => {
    //                 setStatus('saved')
    //                 setSubmitting(false)
    //                 this.setState({modal_alert_status: "open", title: 'Нэр давхцаж байна', icon: 'danger'})
    //             }, 800)
    //         }
    //     })

    // }

    // modalClose(){
    //     this.props.history.push(`/back/org-role/`)
    //     this.setState({modal_alert_status: "closed"})
    //     clearTimeout(this.state.timer)
    // }

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
                                        <h5 className="login name gp-text-primary mt-3">НЭВТРЭХ ХЭСЭГ</h5>
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Имэйл</label>
                                        <input type="text" className="form-control form-control-sm" placeholder="Имэйл хаяг"></input>
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Нууц үг</label>
                                        <input type="text" className="form-control form-control-sm" placeholder="Нууц үг"></input>
                                    </div>
                                    <button type="submit" className="btn gp-btn-primary">Нэвтрэх</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
