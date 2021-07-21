import React, { Component } from "react";
import {service} from '../service'

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_detail: [],
            is_superuser:false
          }
            this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
    }

    componentDidMount() {
        this.handleSaveSuccess()
    }

    handleSaveSuccess(){
        service
        .detail()
        .then(({user_detail}) => {
            this.setState({user_detail})
        })
    }

    render() {
        const {last_name, first_name, email, gender, username, register} = this.state.user_detail
        return (
            <div className="card">
                <div className="card-body">
                    <div className="col-6 my-4">
                        <div className="row">
                            <div className="col-md-12">
                            <h4 className="font-weight-bold form-group">ХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ</h4>
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold col-6">Хэрэглэгчийн нэр:</label>
                                        <span className="control-label col-6">{username}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold col-6">Овог:</label>
                                        <span className="control-label col-6">{last_name}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold col-6">Нэр:</label>
                                        <span className="control-label col-6">{first_name}</span>
                                    </div>
                                </div>  
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold col-6">Цахим хаяг:</label>
                                        <span className="control-label col-6">{email}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold col-6">Хүйс:</label>
                                        <span className="control-label col-6">{gender}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold col-6">Регистер:</label>
                                        <span className="control-label col">{register}</span>
                                    </div>
                                </div>
                                <button onClick={() => this.props.history.push(`/gov/profile/password/`)} className="btn gp-btn-primary">Нууц үг солих</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    }
