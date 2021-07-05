import React, { Component, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import MenuItem from '@utils/MenuItem';
import SuspenseLoader from "@utils/Loader/SuspenseLoader"
import { DisplayNotif } from '@utils/Notification'
import DisplayModal from "@utils/Modal/DisplayModal"

const WMSPage = React.lazy(() => import("./WMSPage"))
const BundlePage = React.lazy(() => import("./BundlePage"))
const DevPage = React.lazy(() => import("./DevPage"))
const Org = React.lazy(() => import("./Org"))
const UserPage = React.lazy(() => import("./UserPage"))
const СуурьДавхаргаХуудас = React.lazy(() => import("./СуурьДавхаргаХуудас"))
const ConfigPage = React.lazy(() => import("./ConfigPage"))
const Log = React.lazy(() => import("./Log"))
const Gis = React.lazy(() => import("./Gis"))
const Access = React.lazy(() => import("./Access"))
const Huulga = React.lazy(() => import("./Huulga"))
const DedsanBvtets = React.lazy(() => import('./DedsanBvtets'))
const Geoserver = React.lazy(() => import('./Geoserver'))
const InspireViews = React.lazy(() => import('./InspireViews'))
const OrgRole = React.lazy(() => import('./OrgRole'))
const Error500 = React.lazy(() => import('./Error500'))
const PasswordChange = React.lazy(() => import('./Prifile/PasswordChange'))
const GPGeoserver = React.lazy(() => import('./GPGeoserver/index'))
const AnotherBaseConfig = React.lazy(() => import('./AnotherBase'))
const DBExport = React.lazy(() => import('./DBExport'))

import {service} from './service';
export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  getModalFunc(setModal) {
    global.MODAL = setModal
  }

  getNotifFunc(setNotif) {
    global.NOTIF = setNotif
  }

  render() {
    return (
      <div>
        <DisplayModal getModalFunc={this.getModalFunc}/>
        <DisplayNotif getNotifFunc={this.getNotifFunc}/>
        <Suspense fallback={<SuspenseLoader is_loading={true} text={"Хуудас ачааллаж байна."}/>}>
          <BrowserRouter>
            <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true" className="color-sidebar bg-dark">
              <div className="brand-logo">
                <a href="/">
                  <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                  <h5 className="logo-text">ГЕОПОРТАЛ</h5>
                </a>
              </div>
            <TabBars />
            </div>
              <div className="content-wrapper">
                <Profile user={this.props.user}/>
                <Switch>
                  <Route path={"/back/wms/"} component={WMSPage} />
                  <Route path={"/back/geoserver/"} component={Geoserver} />
                  <Route path={"/back/org-role/"} component={OrgRole} />
                  <Route
                    path="/back/байгууллага/"
                    render={(props) => <Org {...props} refreshCount={this.handleCount} />}
                  />
                  <Route path={"/back/дэд-сан-бүтэц/"} render={(props) => <DedsanBvtets {...props} />} />
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
                  <Route path={"/back/error500/"} component={Error500} />
                  <Route path={"/back/дэд-сан/"} component={BundlePage} />
                  <Route path={"/back/gp-geoserver/layer-groups/"} component={GPGeoserver} />
                  <Route path={"/back/gp-geoserver/style/"} component={GPGeoserver} />
                  <Route path={"/back/another-base/"} component={AnotherBaseConfig} />
                  <Route path={"/back/db-export/"} component={DBExport} />
                  <Route path={"/back/admin/password/change/"} component={PasswordChange} />
                </Switch>
              </div>
          </BrowserRouter>
        </Suspense>
      </div>
    );
  }
}

function Profile(props) {
  const user = props.user
  return (
    <div className="position-absolute t-0 r-0 mt-2 mr-3">
      <div className="btn-group" style={{ zIndex: 1001 }}>
        <a className="dropdown-toggle dropdown-toggle-nocaret border-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
          <span className="user-profile"><img src="/static/assets/image/user.png" className="img-circle" alt="user avatar"></img></span>
        </a>
        <div className="dropdown-menu dropdown-menu-right">
        <a className="dropdown-item user-details">
          <div className="media">
              <div className="avatar"><img className="align-self-start mr-3" src="/static/assets/image/user.png" alt="user avatar"></img></div>
              <div className="media-body">
                  <h6 className="mt-2 user-title">{user.username}</h6>
                  <p className="user-subtitle">{user.email}</p>
              </div>
            </div>
          </a>
          <div className="dropdown-divider"></div>
          <NavLink className="dropdown-item" activeClassName="active" to="/back/admin/password/change/"><i className="icon-lock mr-2"></i>НУУЦ ҮГ СОЛИХ</NavLink>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item text-dark" href="/logout/"><i className="icon-power mr-2"></i>ГАРАХ</a>
        </div>
      </div>
    </div>
  )
}

function TabBars(props) {

  const [user_count, setUserCount] = useState(0)
  const [gov_count, setGovCount] = useState([])

  useEffect(() => {
    handleCount()
    global.handleCount = handleCount
  }, [])

  const handleCount = () => {
    Promise.all([
      service.userCount(),
      service.govCount(),
    ]).then(([{ user_count }, { gov_count }]) => {
      setUserCount(user_count)
      setGovCount(gov_count)
    })
  }

  return (
    <ul className="sidebar-menu ">
      <MenuItem icon="fa fa-history" url="/back/access/login/" text="Хандалт"></MenuItem>
      <MenuItem icon="fa fa-bank" url="/back/log/" text="Банк лог"></MenuItem>
      <MenuItem icon="fa fa-database" url="/back/дэд-сан/" text="Дэд сан">
          <ul className="sidebar-submenu">
              <MenuItem icon="fa fa-circle-o" url="/back/дэд-сан/" text="Дэд сан"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/дэд-сан-бүтэц/" text="Бүтэц"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/inspire-views/" text="View"></MenuItem>
          </ul>
      </MenuItem>
      <MenuItem icon="fa fa-globe" url="/back/layer-groups/" text="Geoserver">
          <ul className="sidebar-submenu">
              <MenuItem icon="fa fa-circle-o" url="/back/gp-geoserver/layer-groups/" text="Layer-Group"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/gp-geoserver/style/" text="Style"></MenuItem>
          </ul>
      </MenuItem>
      <MenuItem icon="zmdi zmdi-image-alt" url="/back/wms/" text="WMS"></MenuItem>
      <MenuItem icon="fa fa-users" url="/back/байгууллага/түвшин/" text="Байгууллага">
          <ul className="sidebar-submenu">
              <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/1/" text="1-р түвшин" count={gov_count.level1 != 0 ? gov_count.level1 : '0'}></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/2/" text="2-р түвшин" count={gov_count.level2 != 0 ? gov_count.level2 : '0'}></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/3/" text="3-р түвшин" count={gov_count.level3 != 0 ? gov_count.level3 : '0'}></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/4/" text="4-р түвшин" count={gov_count.level4 != 0 ? gov_count.level4 : '0'}></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/org-role/" text="Байгууллага эрх"></MenuItem>
          </ul>
      </MenuItem>
      <MenuItem icon="icon-layers" url="/back/суурь-давхарга/" text="Суурь давхрага"></MenuItem>
      <MenuItem icon="fa fa-user" url="/back/user/" text="Хэрэглэгч" count={user_count}></MenuItem>
      <MenuItem icon="fa fa-arrow-circle-o-down" url="/back/another-base/" text="Database IO">
        <ul className="sidebar-submenu">
            <MenuItem icon="fa fa-circle-o" url="/back/another-base/" text="Өгөгдөл оруулах"></MenuItem>
            <MenuItem icon="fa fa-circle-o" url="/back/db-export/" text="Өгөгдөл гаргах"></MenuItem>
        </ul>
      </MenuItem>
      <MenuItem icon="fa fa-cogs" url="/back/тохиргоо/" text="Тохиргоо">
          <ul className="sidebar-submenu">
              <MenuItem icon="fa fa-circle-o" url="/back/gis/" text="GIS"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/dev/" text="Хөгжүүлэлт"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/geoserver/layers/" text="GeoServer"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/тохиргоо/" text="Сайт параметр"></MenuItem>
              <MenuItem icon="fa fa-circle-o" url="/back/error500/" text="Error500"></MenuItem>
          </ul>
      </MenuItem>
  </ul>
  );
}
