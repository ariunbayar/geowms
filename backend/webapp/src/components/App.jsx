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
import {Gis} from "./Gis"
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
                <MenuItem icon="gp-text-primary fa fa-history" url={"/back/access/login/"}>ХАНДАЛТ</MenuItem>
                <MenuItem icon="gp-text-primary fa fa-bank" url={"/back/log/"}>БАНК ЛОГ</MenuItem>
                <MenuItem icon="gp-text-primary fa fa-database" url={"/back/дэд-сан/"}>ДЭД САН</MenuItem>
                <MenuItem icon="gp-text-primary zmdi zmdi-image-alt" url={"/back/wms/"}>WMS</MenuItem>
              <li>
                <a className="waves-effect">
                  <i className="gp-text-primary fa fa-users"></i> <span>БАЙГУУЛЛАГА</span> <i className="fa fa-angle-left pull-right"></i>
                </a>
                {/* <a activeClassName="active" to={"/back/access/login/"} className="waves-effect">
                </a> */}
                <ul className="sidebar-submenu">
                  <MenuItem icon="fa fa-circle-o gp-text-primary" url={"/back/байгууллага/түвшин/1/"}>1-р түвшин</MenuItem>
                  <MenuItem icon="fa fa-circle-o gp-text-primary" url={"/back/байгууллага/түвшин/2/"}>2-р түвшин</MenuItem>
                  <MenuItem icon="fa fa-circle-o gp-text-primary" url={"/back/байгууллага/түвшин/3/"}>3-р түвшин</MenuItem>
                  <MenuItem icon="fa fa-circle-o gp-text-primary" url={"/back/байгууллага/түвшин/4/"}>4-р түвшин</MenuItem>
                </ul>
              </li>
                <MenuItem icon="gp-text-primary icon-layers" url={"/back/суурь-давхарга/"}>СУУРЬ ДАВХРАГА</MenuItem>
                <MenuItem icon="gp-text-primary fa fa-connectdevelop" url={"/back/dev/"}>ХӨГЖҮҮЛЭЛТ</MenuItem>
                <MenuItem icon="gp-text-primary fa fa-user" url={"/back/user/"}>ХЭРЭГЛЭГЧ</MenuItem>
                <MenuItem icon="gp-text-primary icon-map" url={"/back/gis/"}>GIS</MenuItem>
                <MenuItem icon="gp-text-primary fa fa-cogs" url={"/back/тохиргоо/"}>ТОХИРГОО</MenuItem>
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
            <Route path={"/back/gis/"} component={Gis} />
            <Route path={"/back/тохиргоо/"} component={ConfigPage} />
            <Route path={"/back/дэд-сан/"} component={BundlePage} />
          </Switch>
        </div>
      </BrowserRouter>
      </div>
    );
  }
}
