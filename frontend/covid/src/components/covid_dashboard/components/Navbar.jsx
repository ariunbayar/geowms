import React, { PureComponent } from 'react';
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

class Navbar extends PureComponent {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink to={"/covid_dashboard/"}
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    CASES
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/covid_dashboard/"}
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    Vaccine
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/covid_dashboard/graph/"}
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    Graphs
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;
