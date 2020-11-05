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
import {DedsanBvtets} from './DedsanBvtets'
import {Geoserver} from './Geoserver'
import {InspireViews} from './InspireViews'

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
          <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true" className="color-sidebar bg-dark">
            <div className="brand-logo">
              <a href="/">
                <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                <h5 className="logo-text">ГЕОПОРТАЛ</h5>
              </a>
            </div>
            <ul className="sidebar-menu do-nicescrol">
                <MenuItem icon="fa fa-history" url="/back/access/login/" text="Хандалт"></MenuItem>
                <MenuItem icon="fa fa-bank" url="/back/log/" text="Банк лог"></MenuItem>
                <MenuItem icon="fa fa-database" url="/back/дэд-сан/" text="Дэд сан">
                    <ul className="sidebar-submenu">
                        <MenuItem icon="fa fa-circle-o" url="/back/дэд-сан/" text="Дэд сан"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/дэд-сан-бүтэц/" text="Бүтэц"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/inspire-views/" text="View"></MenuItem>
                    </ul>
                </MenuItem>
                <MenuItem icon="zmdi zmdi-image-alt" url="/back/wms/" text="WMS"></MenuItem>
                <MenuItem icon="fa fa-users" url="/back/байгууллага/түвшин/" text="Байгууллага">
                    <ul className="sidebar-submenu">
                        <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/1/" text="1-р түвшин"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/2/" text="2-р түвшин"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/3/" text="3-р түвшин"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/4/" text="4-р түвшин"></MenuItem>
                    </ul>
                </MenuItem>
                <MenuItem icon="icon-layers" url="/back/суурь-давхарга/" text="Суурь давхрага"></MenuItem>
                <MenuItem icon="fa fa-user" url="/back/user/" text="Хэрэглэгч"></MenuItem>
                <MenuItem icon="fa fa-cogs" url="/back/тохиргоо/" text="Тохиргоо">
                    <ul className="sidebar-submenu">
                        <MenuItem icon="fa fa-circle-o" url="/back/gis/" text="GIS"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/dev/" text="Хөгжүүлэлт"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/geoserver/layers/" text="GeoServer"></MenuItem>
                        <MenuItem icon="fa fa-circle-o" url="/back/тохиргоо/" text="Сайт параметр"></MenuItem>

                    </ul>
                </MenuItem>
            </ul>
          </div>
          <div className="content-wrapper">
            <Switch>
              <Route path={"/back/wms/"} component={WMSPage} />
              <Route path={"/back/geoserver/"} component={Geoserver} />
              <Route path={"/back/байгууллага/"} component={Org} />
              <Route path={"/back/дэд-сан-бүтэц/"} component={DedsanBvtets} />
              <Route path={"/back/inspire-views/"} component={InspireViews} />
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
