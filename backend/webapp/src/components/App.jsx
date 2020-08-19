import React, {Component} from "react";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

import {WMSPage} from "./WMSPage";
import {BundlePage} from "./BundlePage";
import {DevPage} from "./DevPage";
import {Org} from "./Org";
import {UserPage} from "./UserPage";
import { СуурьДавхаргаХуудас } from "./СуурьДавхаргаХуудас";
import {service} from "./service";
import {ConfigPage} from "./ConfigPage";
import {Log} from "./Log"
import {Access} from "./Access"
import {Huulga} from "./Huulga"


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user_count: 0,
        };
    }

    componentDidMount() {

        service.userCount().then(({ user_count }) => {
            this.setState({ user_count: user_count });
        });

    }

  render() {
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-dark gp-bg-primary py-0">
          <div className="container">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation"  >
              <span className="navbar-toggler-icon"></span>
            </button>

            <a className="navbar-brand" href="/">
              <i className="fa fa-map mr-2" aria-hidden="true"></i>
              ГЕОПОРТАЛ
            </a>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
              <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/access/login/"}>ACCESS</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/huulga/"}>ХУУЛГА</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/log/"}>ЛОГ</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/дэд-сан/"}>ДЭД САН</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/wms/"}>WMS</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/байгууллага/түвшин/"}>БАЙГУУЛЛАГА</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/суурь-давхарга/"}> СУУРЬ ДАВХРАГА</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/dev/"}>ХӨГЖҮҮЛЭЛТ</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/user"}>ХЭРЭГЛЭГЧ ({this.state.user_count})</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to={"/back/тохиргоо/"}>ТОХИРГОО</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="main-content">
          <Switch>
            <Route path={"/back/wms/"} component={WMSPage} />
            <Route path={"/back/байгууллага/"} component={Org} />
            <Route exact path={"/back/log/"} component={Log} />
            <Route path={"/back/access/"} component={Access} />
            <Route exact path={"/back/huulga/"} component={Huulga} />
            <Route
              path={"/back/суурь-давхарга/"}
              component={СуурьДавхаргаХуудас}
            />
            <Route exact path={"/back/dev/"} component={DevPage} />
            <Route path={"/back/user/"} component={UserPage} />
            <Route path={"/back/тохиргоо/"} component={ConfigPage} />
            <Route path={"/back/дэд-сан/"} component={BundlePage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
