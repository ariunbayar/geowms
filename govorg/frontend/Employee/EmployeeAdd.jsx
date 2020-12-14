import React, { Component } from "react"
// import ModalAlert from '../../../backend/webapp/src/components/ModalAlert'
// import { service } from "../service"

export class EmployeeAdd extends Component {

    render() {
        return (
            <div className='card'>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="last_name">Овог:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="last_name"
                                                placeholder="Овог"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="first_name">Нэр:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="first_name"
                                                placeholder="Нэр"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="email">E-Mail</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="email"
                                                placeholder="E-Mail"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-row">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="password">Нууц үг:</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Нууц үг"
                                                />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="re_password">Нууц үг дахин оруулах:</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="re_password"
                                                placeholder="Нууц үг дахин оруулах"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <button className="btn gp-btn-primary">
                                    Хадгалах
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
