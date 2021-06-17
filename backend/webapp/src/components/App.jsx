import React, {Component, Suspense} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

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
      user_count: 0,
      gov_count: [],
      setModal: null,
      setNotif: null,
    };
    this.handleBoxOver = this.handleBoxOver.bind(this)
    this.hanfleCounts = this.hanfleCounts.bind(this)
    this.getModalFunc = this.getModalFunc.bind(this)
    this.getNotifFunc = this.getNotifFunc.bind(this)
  }

  handleBoxOver (field){
    this.setState({ [field]: true })
  }

  componentDidMount() {
    this.hanfleCounts()
  }

  hanfleCounts(){
    Promise.all([
      service.userCount(),
      service.govCount(),
    ]).then(([{user_count}, {gov_count}]) => {
      this.setState({user_count, gov_count})
    })
  }

  getModalFunc(setModal) {
    this.setState({ setModal })
  }

  getNotifFunc(setNotif) {
      this.setState({ setNotif })
  }

  render() {
      const { setModal, setNotif } = this.state
      const need_props = {
          setModal,
          setNotif
      }
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
                            <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/1/" text="1-р түвшин" count={this.state.gov_count.level1 != 0 ? this.state.gov_count.level1 : '0'}></MenuItem>
                            <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/2/" text="2-р түвшин" count={this.state.gov_count.level2 != 0 ? this.state.gov_count.level2 : '0'}></MenuItem>
                            <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/3/" text="3-р түвшин" count={this.state.gov_count.level3 != 0 ? this.state.gov_count.level3 : '0'}></MenuItem>
                            <MenuItem icon="fa fa-circle-o" url="/back/байгууллага/түвшин/4/" text="4-р түвшин" count={this.state.gov_count.level4 != 0 ? this.state.gov_count.level4 : '0'}></MenuItem>
                            <MenuItem icon="fa fa-circle-o" url="/back/org-role/" text="Байгууллага эрх"></MenuItem>
                        </ul>
                    </MenuItem>
                    <MenuItem icon="icon-layers" url="/back/суурь-давхарга/" text="Суурь давхрага"></MenuItem>
                    <MenuItem icon="fa fa-user" url="/back/user/" text="Хэрэглэгч" count={this.state.user_count}></MenuItem>
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
              </div>
              {
                setModal && setNotif
                ?
                  <div className="content-wrapper">
                    <Switch>
                      <Route path={"/back/wms/"} component={WMSPage} />
                      <Route path={"/back/geoserver/"} component={Geoserver} />
                      <Route path={"/back/org-role/"} component={OrgRole} />
                      <Route
                        path="/back/байгууллага/"
                        component={(props) => <Org {...props} refreshCount={this.hanfleCounts} />}
                      />
                      <Route path={"/back/дэд-сан-бүтэц/"} component={(props) => <DedsanBvtets {...props} {...need_props} />} />
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
                    </Switch>
                  </div>
                :
                  null
              }
            </BrowserRouter>
          </Suspense>
        </div>
    );
  }
}