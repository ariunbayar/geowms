import React, { Component } from 'react'
import { service } from './service'
import ModalAlert from "../../ModalAlert";
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

export class PasswordChange extends Component {

    constructor(props) {

        super(props)
        this.state = {
            modal_alert_status: "closed",
            timer: null,
            model_type_icon: "success",
            msg: "Нууц үг солиход алдаа гарлаа.",
            reset: false,
        }
        this.handSave = this.handSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    handSave() {
        const password = document.getElementById('password').value
        const new_password = document.getElementById('new_password').value
        const renew_password = document.getElementById('renew_password').value
        if (new_password === renew_password){
            const values = {"old_password": password, "new_password": new_password}
            service.passwordChange(values).then(({success, msg, error}) => {
                if (success) {
                    this.setState({modal_alert_status: "open", model_type_icon: 'success', msg, reset: true})
                    this.modalCloseTime()
                }
                else{
                    this.setState({modal_alert_status: "open", model_type_icon: 'danger', msg: error})
                    this.modalCloseTime()
                }
            })
        }
        else{
            this.setState({modal_alert_status: "open", model_type_icon: 'danger', msg: "Шинэ нууц үг буруу"})
            this.modalCloseTime()
        }
    }

    modalClose(){
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
            if (this.state.reset){
                return (
                    alert('login huudasruu shiljiil')
                )
            }
        }, 2222)
    }


    render() {

        return (
            <>
                <div className="d-flex align-items-center justify-content-center" style={{marginTop: "180px"}}>
                    <div className="card border-primary border-top-sm border-bottom-sm card-authentication1 mx-auto animated bounceInDown">
                        <div className="card-body">
                            <div className="card-content p-2">
                                <div className="text-center">
                                    <i className="fa fa-key fa-3x"></i>
                                </div>
                                <div className="card-title text-uppercase text-center py-3">Нууц үг солих</div>
                                    <form>
                                        <div className="form-group">
                                            <div className="position-relative has-icon-right">
                                                <label htmlFor="password">Хуучин нууц үг</label>
                                                <input type="password" id="password" className="form-control form-control-rounded" placeholder="Хуучин нууц үгээ оруулна уу"></input>
                                                <div className="form-control-position">
                                                    <i className="icon-lock"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="position-relative has-icon-right">
                                                <label htmlFor="new_password">Шинэ нууц үг</label>
                                                <input type="password" id="new_password" className="form-control form-control-rounded" placeholder="Шинэ нууц үгээ оруулна уу"></input>
                                                <div className="form-control-position">
                                                    <i className="icon-lock"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="position-relative has-icon-right">
                                                <label htmlFor="renew_password">Шинэ нууц үг</label>
                                                <input type="password" id="renew_password" className="form-control form-control-rounded" placeholder="Шинэ нууц үгээ дахин оруулна уу"></input>
                                                <div className="form-control-position">
                                                    <i className="icon-lock"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary shadow-primary btn-round btn-block waves-effect waves-light" onClick={() => this.handSave()}>Хадгалах</button>
                                    </form>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title = {this.state.msg}
                    model_type_icon = {this.state.model_type_icon}
                />
            </>
        )
    }
}
