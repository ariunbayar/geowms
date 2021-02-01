import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { System } from "./System"
import { Meta } from './Meta'
import { RevokeRequest } from './RevokeRequest'
import { Password } from './User/Password'
import { Profile } from './User/Profile'
import InsPerms from './Role/Role/GovPerms'
import Gov from './Role/Gov/index'
import { Employee } from './Role/Employee'
import Bundles from './Bundles/Inspire'
import { TuuhenOv } from './Bundles/TuuhenOv'
import { Forms } from './Bundles/Form'
import { ZipCode } from './Bundles/Zipcode'
import OrgRequest from './OrgRequest'
import ChangeRequest from './Bundles/Inspire/ChangeRequest'

import { Help } from './Help'
import { service } from "./service"
import MenuItem from "@utils/MenuItem"
import { Role } from './Role';

export class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            org_level: props.org.org_level,
            name: props.org.name,
            map_list: [],
            emp_role: {},
            approve: false,
            revoke: false,
        }
        this.requestCount = this.requestCount.bind(this)
        this.getEmpRoles = this.getEmpRoles.bind(this)
        this.getApproveAndRevoke = this.getApproveAndRevoke.bind(this)
    }

    componentDidMount() {
        this.requestCount()
        this.getEmpRoles()
        this.getApproveAndRevoke()
    }

    requestCount() {
        // service.component
        service.getCount().then(({ success, count, revoke_count, info }) => {
            if (success) {
                this.setState({ request_count: count, revoke_count })
            } else {
                // TODO
            }
        })
    }

    getEmpRoles(){
        // menu хэрэглэгчийн эрхээр
        service.getEmpRoles().then(({ success, emp_role }) => {
            if (success) {
                console.log(emp_role);
                this.setState({ emp_role })
            }
        })
    }

    getApproveAndRevoke(){
        service.getApproveAndRevoke().then(({ approve, revoke }) => {
            this.setState({ approve, revoke })
        })
    }

    render() {
        const { org_role } = this.props.org
        const { emp_role , approve, revoke } = this.state
        return (
            <BrowserRouter>
                <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
                    <div className="brand-logo">
                        <a href="/">
                            <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                            <h5 className="logo-text">ГЕОПОРТАЛ</h5>
                        </a>
                    </div>
                    <ul className="sidebar-menu do-nicescrol">
                        <MenuItem icon="gp-text-primary fa fa-key" url="#" text="Байгууллага">
                            <ul className="sidebar-submenu">
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/" text="Эрхүүд"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/employee/" text="Хэрэглэгч"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/role/" text="Хэрэглэгчийн эрх"></MenuItem>
                            </ul>
                        </MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-link" url="/gov/system/" text="Систем"></MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/meta/" text="Мета"></MenuItem>
                        { revoke &&
                            <MenuItem
                                icon="gp-text-primary fa fa-times-circle"
                                url="/gov/revoke-request/"
                                text="Цуцлах хүсэлт"
                                count={this.state.revoke_count}
                            ></MenuItem>
                        }
                        { approve &&
                            <MenuItem
                                icon="gp-text-primary fa fa-plug"
                                url="/gov/org-request/"
                                text="Хүсэлт"
                                count={this.state.request_count}
                            >
                            </MenuItem>
                        }
                        <MenuItem icon="gp-text-primary fa fa-database" url="/gov/org/map/" text="Дэд сан">
                            <ul className="sidebar-submenu">
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/tuuhen-ov/" text="Түүхэн өв бүртгэл"></MenuItem>
                                <MenuItem
                                    icon="gp-text-primary fa fa-circle-o"
                                    url="/gov/froms/tseg-info/tsegpersonal/"
                                    text="Цэгийн мэдээлэл"
                                >
                                    <ul className="sidebar-submenu">
                                        <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" text="Шинэ цэг"></MenuItem>
                                        <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" text="Цэг устгах"></MenuItem>
                                    </ul>
                                </MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/zip-code/" text="Зипкод"></MenuItem>

                                    {
                                       Object.keys(emp_role).length >0  && Object.keys(emp_role.themes).length >0 ? emp_role.themes.map((theme, idx)=>
                                        <MenuItem
                                            key={idx}
                                            icon="gp-text-primary fa fa-circle-o"
                                            url={`/gov/org/map/${theme.id}`}
                                            text={theme.name}
                                        >
                                            <ul className="sidebar-submenu">
                                                {
                                                    Object.keys(emp_role.package_features).length >0 ? emp_role.package_features.map((pack, idy) =>
                                                    theme.id == pack.parent_id ?
                                                        <MenuItem
                                                            key={idy}
                                                            icon="fa fa-circle-o gp-text-primary"
                                                            url={`/gov/org/map/${theme.id}/${pack.id}`}
                                                            text={pack.name}
                                                        >
                                                            <ul className="sidebar-submenu">
                                                                {
                                                                    Object.keys(pack.features).length >0 ? pack.features.map((feat, idz) =>
                                                                        <MenuItem
                                                                            key={idz}
                                                                            icon="fa fa-circle-o gp-text-primary"
                                                                            url={`/gov/org/map/${theme.id}/${pack.id}/${feat.id}/`}
                                                                            text={feat.name}
                                                                            count={feat.count}
                                                                        >
                                                                        </MenuItem>
                                                                    ):null
                                                                }
                                                            </ul>
                                                        </MenuItem>
                                                        : null
                                                    ) : null
                                                }
                                            </ul>
                                            </MenuItem>
                                        ): null

                                    }

                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/history/" text="Өөрчлөлтийн түүх"></MenuItem>
                            </ul>
                        </MenuItem>
                        <MenuItem icon="gp-text-primary zmdi zmdi-pin-help" url="/gov/help/" text="Тусламж"></MenuItem>
                    </ul>
                </div>

                <div className="clearfix">
                    <div className="content-wrapper">
                        <Switch>
                            <Route path={"/gov/froms/"} component={Forms} />
                            <Route path="/gov/tuuhen-ov/" component={TuuhenOv} />
                            <Route path="/gov/system/" component={System} />
                            <Route path="/gov/revoke-request/" component={RevokeRequest} />
                            <Route path="/gov/meta/" component={Meta} />

                            <Route path="/gov/perm/role/" component={(props) => <Role {...props} org_roles={org_role} /> } />
                            <Route path="/gov/role/role/" component={Role} />
                            <Route path="/gov/org/map/:tid/:pid/:fid/" component={(props) => <Bundles {...props} refreshCount={() => this.requestCount()} />} />

                            <Route path="/gov/zip-code/" component={ZipCode} />
                            <Route path="/gov/org-request/" component={OrgRequest} />
                            <Route path="/gov/history/" component={ChangeRequest} />
                            <Route exact path="/gov/perm/" component={(props) => <InsPerms {...props} org_roles={org_role}/>} />
                            <Route exact path="/gov/perm/org/" component={Gov} />
                            <Route path="/gov/perm/employee/" component={(props) => <Employee {...props} org_roles={org_role} getEmpRoles={this.getEmpRoles}/>}/>
                            <Route exact path="/gov/help/" component={Help} />
                            <Route exact path="/gov/profile/" component={Profile} />
                            <Route exact path="/gov/profile/password/" component={Password} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
