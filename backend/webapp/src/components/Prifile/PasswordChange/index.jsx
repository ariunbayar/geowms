import React, { Component } from 'react'
import { service } from './service'

export default class PasswordChange extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_save_success: null,
            msg: '',
            old_password: '',
            new_password: '',
            renew_password: '',
            save_btn_status: 'disabled',
        }
        this.handleSave = this.handleSave.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(name, value) {
        this.setState({[name]: value, is_save_success: null})
        if (this.state.old_password && this.state.new_password && this.state.renew_password) {
            this.setState({save_btn_status: 'active'})
        }
    }

    handleSave() {
        const {old_password, new_password, renew_password}= this.state
        this.setState({save_btn_status: 'disabled'})
        if (new_password === renew_password){
            const values = {old_password, new_password}
            service.updatePassword(values).then(({success, msg, error}) => {
                success ?
                    null
                :
                    msg = error
                this.setState({is_save_success: success, msg})
            })
        } else {
            this.setState({is_save_success: false, msg: "Шинэ нууц үг буруу"})
        }
    }

    render() {

        return (

            <div className="d-flex align-items-center justify-content-center pt-5 mt-5">
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
                                        <input type="password" className="form-control form-control-rounded"
                                            disabled={this.state.is_save_success === true}
                                            placeholder="Хуучин нууц үгээ оруулна уу"
                                            value={this.state.old_password}
                                            onChange={(e) => this.handleChange('old_password', e.target.value)}></input>
                                        <div className="form-control-position">
                                            <i className="icon-lock"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                        <label htmlFor="new_password">Шинэ нууц үг</label>
                                        <input type="password" className="form-control form-control-rounded"
                                            disabled={this.state.is_save_success === true}
                                            placeholder="Шинэ нууц үгээ оруулна уу"
                                            value={this.state.new_password}
                                            onChange={(e) => this.handleChange('new_password', e.target.value)}></input>
                                        <div className="form-control-position">
                                            <i className="icon-lock"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                        <label htmlFor="renew_password">Шинэ нууц үг ( давтах )</label>
                                        <input type="password" className="form-control form-control-rounded"
                                            disabled={this.state.is_save_success === true}
                                            placeholder="Шинэ нууц үгээ дахин оруулна уу"
                                            value={this.state.renew_password}
                                            onChange={(e) => this.handleChange('renew_password', e.target.value)}></input>
                                        <div className="form-control-position">
                                            <i className="icon-lock"></i>
                                        </div>
                                    </div>
                                </div>
                                    {this.state.is_save_success === true &&
                                        <div className="alert alert-outline-success alert-dismissible alert-round" role="alert">
                                            <div className="alert-icon">
                                                <i className="icon-check ml-3"></i>
                                            </div>
                                            <div className="alert-message w-100 text-dark text-center">
                                                <span>{this.state.msg}</span><br></br>
                                                <a href="/login/">Та дахин нэвтэрнэ үү.</a>
                                            </div>
                                        </div>
                                    }
                                    {this.state.is_save_success === false &&
                                        <div className="alert alert-outline-danger alert-dismissible alert-round" role="alert">
                                            <div className="alert-icon">
                                                <i className="icon-close ml-3"></i>
                                            </div>
                                            <div className="alert-message w-100 text-center">
                                                <span>{this.state.msg}</span>
                                            </div>
                                        </div>
                                    }
                                <button type="button"
                                    className={`btn btn-primary shadow-primary btn-round btn-block waves-effect waves-light ${this.state.save_btn_status === 'active' ? 'active' : 'disabled'}`}
                                    onClick={this.handleSave}>Хадгалах
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
