import React, { Component } from "react";
import {service} from '../service'

export class Profile extends Component {
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
                            <div className="col-md-12">\
                            <h4>ХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ</h4>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Хэрэглэгчийн нэр:</label>
                                        <span className="form-control" id="price">{username}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <label className="col-form-label">Овог:</label>
                                        <span className="form-control" id="price">{last_name}</span>
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label className="col-form-label">Нэр:</label>
                                        <span className="form-control" id="price">{first_name}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Цахим хаяг:</label>
                                        <span className="form-control" id="price">{email}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Хүйс:</label>
                                        <span className="form-control" id="price">{gender}</span>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Регистер:</label>
                                        <span className="form-control" id="price">{register}</span>
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