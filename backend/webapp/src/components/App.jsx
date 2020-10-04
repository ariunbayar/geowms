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
import MenuItem from "../../../../src/components/MenuItem"

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user_count: 0,
    };
    this.handleBoxOver = this.handleBoxOver.bind(this)
  }

  handleBoxOver (field){
    this.setState({ [field]: true })
  }

  componentDidMount() {

    service.userCount().then(({ user_count }) => {
      this.setState({ user_count: user_count });
    });
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
            <div className="brand-logo">
                <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                <h5 className="logo-text">ГЕОПОРТАЛ</h5>
            </div>
            <ul className="sidebar-menu do-nicescrol">
              <li className="sidebar-header">УДИРДАГЧИЙН ХЭСЭГ</li>
              <li>
                <NavLink activeClassName="active" to={"/back/access/login/"} className="waves-effect">
                  <i className="icon-map"></i> <span>ХАНДАЛТ</span> <i className="fa fa-angle-left pull-right"></i>
                </NavLink>
                <ul className="sidebar-submenu">
                  <li><NavLink  activeClassName="active" to={"/back/access/login/"}><i className="fa fa-circle-o"></i>Оролт гаралт</NavLink></li>
                  <li><NavLink  activeClassName="active" to={"/back/access/logout/"}><i className="fa fa-circle-o"></i>Үйлдэл</NavLink></li>
                  <li><NavLink  activeClassName="active" to={"/back/access/page/"}><i className="fa fa-circle-o"></i>Хуудас хандалт</NavLink></li>
                </ul>
              </li>
                <MenuItem url={"/back/log/"}>БАНК ЛОГ</MenuItem>
                <MenuItem url={"/back/дэд-сан/"}>ДЭД САН</MenuItem>
                <MenuItem url={"/back/wms/"}>WMS</MenuItem>
              <li>
                <a className="waves-effect">
                  <i className="fa fa-users"></i> <span>БАЙГУУЛЛАГА</span> <i className="fa fa-angle-left pull-right"></i>
                </a>
                {/* <a activeClassName="active" to={"/back/access/login/"} className="waves-effect">
                </a> */}
                <ul className="sidebar-submenu">
                  <MenuItem url={"/back/байгууллага/түвшин/1/"}>1-р түвшин</MenuItem>
                  <MenuItem url={"/back/байгууллага/түвшин/2/"}>2-р түвшин</MenuItem>
                  <MenuItem url={"/back/байгууллага/түвшин/3/"}>3-р түвшин</MenuItem>
                  <MenuItem url={"/back/байгууллага/түвшин/4/"}>4-р түвшин</MenuItem>
                </ul>
              </li>
                <MenuItem icon="icon-layers" url={"/back/суурь-давхарга/"}>СУУРЬ ДАВХРАГА</MenuItem>
                <MenuItem url={"/back/dev/"}>ХӨГЖҮҮЛЭЛТ</MenuItem>
                <MenuItem url={"/back/user/"}>ХЭРЭГЛЭГЧ</MenuItem>
                <MenuItem icon="fa fa-cogs" url={"/back/тохиргоо/"}>ТОХИРГОО</MenuItem>
            </ul>
          </div>
        <div className="content-wrapper">
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
      </div>
    );
  }
}
