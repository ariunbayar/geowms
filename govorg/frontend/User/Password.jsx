import React, { Component } from "react";


export class Password extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="password">Хуучин нууц үг:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Одоогийн нууц үг оруулах"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="re_password">Шинэ нууц үг:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="new_password"
                                placeholder="Шинэ нууц үг оруулах"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="re_password">Шинэ нууц үг дахин оруулах:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="re_new_password"
                                placeholder="Шинэ нууц үг дахин оруулах"
                            />
                        </div>
                    </div>
                    <button className="btn gp-btn-primary">Хадгалах</button>
                </div>
            </div>
        );
    }
}