import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom"

import {WMSPage} from "./WMSPage"
import {BundlePage} from "./BundlePage"
import {DevPage} from "./DevPage"
import {UserPage} from "./UserPage"


export default class App extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <BrowserRouter>
                <nav className="navbar navbar-expand-lg navbar-dark gp-bg-primary py-0">
                    <div className="container">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <a className="navbar-brand" href="/">
                            <i className="fa fa-map mr-2" aria-hidden="true"></i>
                            ГЕОПОРТАЛ
                        </a>

                        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/"}>Дэд Сан</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/wms/"}>WMS</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/dev/"}>Хөгжүүлэлт</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/user"}>Хэрэглэгч</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="main-content">
                    <Switch>
                        <Route exact path={"/back/wms/"} component={WMSPage}/>
                        <Route exact path={"/back/"} component={BundlePage}/>
                        <Route exact path={"/back/dev/"} component={DevPage}/>
                        <Route exact path={"/back/user/"} component={UserPage}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

