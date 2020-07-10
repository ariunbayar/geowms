import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom"

import {WMSPage} from "./WMSPage"
import {BundlePage} from "./BundlePage"
import {DevPage} from "./DevPage"
import {UserPage} from "./UserPage"
import {GovorgPage} from "./GovorgPage"
import {СуурьДавхаргаХуудас} from './СуурьДавхаргаХуудас'
import {service} from './service'
import {Config} from './Config'

export default class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            govorg_count: 0,
        }
    }

    componentDidMount() {

        service.getGovOrgCount().then(({count}) => {
            this.setState({govorg_count: count})
        })

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
                                    <a className="nav-link" activeClassName="active" href="/back/access/">ACCESS</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" activeClassName="active" href="/back/huulga/">ХУУЛГА</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" activeClassName="active" href="/back/log/">ЛОГ</a>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/"}>ДЭД САН</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/wms/"}>WMS</NavLink>
                                </li>
                                 <li className="nav-item">
                                     <NavLink className="nav-link" activeClassName="active" to={"/back/байгууллага/"}>
                                         БАЙГУУЛЛАГА
                                         {this.state.govorg_count > 0 && ' (' + this.state.govorg_count + ')'}
                                     </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to={"/back/суурь-давхарга/"}>СУУРЬ ДАВХРАГА</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/dev/"}>ХӨГЖҮҮЛЭЛТ</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/user"}>ХЭРЭГЛЭГЧ</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" exact to={"/back/config"}>ТОХИРГОО</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="main-content">
                    <Switch>
                        <Route exact path={"/back/wms/"} component={WMSPage}/>
                        <Route path={"/back/байгууллага/"} component={GovorgPage}/>
                        <Route exact path={"/back/"} component={BundlePage}/>
                        <Route path={"/back/суурь-давхарга/"} component={СуурьДавхаргаХуудас}/>
                        <Route exact path={"/back/dev/"} component={DevPage}/>
                        <Route exact path={"/back/user/"} component={UserPage}/>
                        <Route exact path={"/back/config/"} component={Config}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

