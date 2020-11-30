import React, { Component } from 'react'
import { service } from './service'
import ModalAlert from "../../ModalAlert";
import axios from 'axios';

export class PasswordChange extends Component {

    constructor(props) {

        super(props)
        this.state = {
            modal_alert_status: "closed",
            timer: null,
            model_type_icon: "success",
            msg: "Нууц үг солиход алдаа гарлаа.",
            reset: false,
            password: '',
            new_password: '',
            renew_password: ''
        }
        this.handSave = this.handSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.handChange = this.handChange.bind(this)
    }

    handChange(name, value) {
        if (name === 'password'){
            this.setState({password: value})
        }
        if (name === 'new_password'){
            this.setState({new_password: value})
        }
        if (name === 'renew_password'){
            this.setState({renew_password: value})
        }
    }

    handSave() {
        const password = this.state.password
        const new_password = this.state.new_password
        const renew_password = this.state.renew_password
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
        if (this.state.reset){
            return (
                window.location.reload()
            )
        }
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
            if (this.state.reset){
                return (
                    window.location.reload()
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
                                                <input type="password" className="form-control form-control-rounded" placeholder="Хуучин нууц үгээ оруулна уу" value={this.state.password} onChange={(e) => this.handChange('password', e.target.value)}></input>
                                                <div className="form-control-position">
                                                    <i className="icon-lock"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="position-relative has-icon-right">
                                                <label htmlFor="new_password">Шинэ нууц үг</label>
                                                <input type="password" className="form-control form-control-rounded" placeholder="Шинэ нууц үгээ оруулна уу" value={this.state.new_password} onChange={(e) => this.handChange('new_password', e.target.value)}></input>
                                                <div className="form-control-position">
                                                    <i className="icon-lock"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="position-relative has-icon-right">
                                                <label htmlFor="renew_password">Шинэ нууц үг</label>
                                                <input type="password" className="form-control form-control-rounded" placeholder="Шинэ нууц үгээ дахин оруулна уу" value={this.state.renew_password} onChange={(e) => this.handChange('renew_password', e.target.value)}></input>
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
