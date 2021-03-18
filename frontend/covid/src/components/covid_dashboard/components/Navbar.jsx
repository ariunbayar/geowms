import React, { PureComponent } from 'react';
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

class Navbar extends PureComponent {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <NavLink to={"/covid_dashboard/"} activeClassName="active">
                                <a className="nav-link" href="#">CASES <span className="sr-only">(current)</span></a>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/covid_dashboard/"} activeClassName="active">
                                <a className="nav-link" href="#">Vaccine</a>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/covid_dashboard/graph/"} activeClassName="active">
                                <a className="nav-link" href="#">Graphs</a>
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
