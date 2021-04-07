import React, { Component } from 'react';
import { NavLink } from "react-router-dom"

class ConfigTitles extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    Mssql Connection Тохиргоо
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="card col-md-6">
                            <div className="card-body">
                                <NavLink
                                    to={`/back/another-base/mssql/`}
                                    className="col-md-5 ml-2 text-center"
                                    activeClassName="text-white"
                                >
                                    MSSQL ийн тохиргоо
                                </NavLink>
                            </div>
                        </div>
                        <div className="card col-md-6">
                            <div className="card-body">
                                <NavLink
                                    to={`/back/another-base/mssql/insert/`}
                                    className="col-md-3 ml-2 text-center"
                                    activeClassName="text-white gp-bg-primary"
                                >
                                    MSSQL insert
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfigTitles;