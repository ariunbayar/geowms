import React, { Component } from 'react';
import { NavLink } from "react-router-dom"

class ConfigTitles extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    Дата бааз сонгох
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                <NavLink
                                    to={`/back/another-base/connection/mssql/`}
                                    className="col-md-5 ml-2 text-center"
                                    activeClassName="text-white"
                                >
                                    MSSQL
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="card-body">
                                <NavLink
                                    to={`/back/another-base/connection/mongo/`}
                                    className="col-md-3 ml-2 text-center"
                                    activeClassName="text-white gp-bg-primary"
                                >
                                    MongoDB
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