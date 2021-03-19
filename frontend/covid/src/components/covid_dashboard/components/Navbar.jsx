import React, { PureComponent } from 'react';
import { Switch, Route, NavLink} from "react-router-dom"
import CovidMap from './covid_map'

class Navbar extends PureComponent {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <NavLink className="waves-effect waves-light" to={'/covid_dashboard/cases/'}>
                                    CASES
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Vaccine</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Graphs</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Switch>
                        <Route path="/covid_dashboard/cases/" component={CovidMap} />
                    </Switch>
            </div>
        );
    }
}

export default Navbar;
