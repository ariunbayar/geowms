import React, { Component } from 'react';
import { NavLink } from "react-router-dom"

class ConfigTitles extends Component {
    render() {
        return (
            <div className="card-body">
                <NavLink
                    to={`/back/another-base/mssql/`}
                    className="list-group-item col-md-12 ml-2 text-center"
                    activeClassName="text-white gp-bg-primary"
                >
                    MSSQL ийн тохиргоо
                </NavLink>
            </div>
        );
    }
}

export default ConfigTitles;