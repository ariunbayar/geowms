import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { System } from "./System"
import { Meta } from './Meta'
import { Profile } from './Profile'

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
import MenuItem from "../../src/components/MenuItem"
import { Role } from './Role';

export class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            org_level: props.org.org_level,
            name: props.org.name,
            tuuhen_ov: {},
            tseg_burtgel: {},
            map_list: [],
        }
        this.requestCount = this.requestCount.bind(this)
    }

    componentDidMount() {

        const { perms } = this.props.org
        perms.map((perm) => {
            if (perm.module_id == 1) {
                this.setState({ tuuhen_ov: perm })
            }
            else if (perm.module_id == 2) {
                this.setState({ tseg_burtgel: perm })
            }
        })

        this.requestCount()
    }

    requestCount() {
        // service.component
        service.getCount().then(({ success, count, info }) => {
            if (success) {
                this.setState({ request_count: count })
            } else {
                console.log(info);
            }
        })
    }

    render() {
        const {
            tuuhen_ov,
            tseg_burtgel,
        } = this.state

        const { org_role } = this.props.org
        const org_inspire = this.props.org.org_inspire
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
                        <MenuItem icon="gp-text-primary fa fa-key" url="#" text="Эрх">
                            <ul className="sidebar-submenu">
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/" text="Эрхүүд"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/org/" text="Байгууллага"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/employee/" text="Хэрэглэгч"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/role/" text="Role"></MenuItem>
                            </ul>
                        </MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/system/" text="Систем"></MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/meta/" text="Мета"></MenuItem>
                        <MenuItem
                            icon="gp-text-primary fa fa-plug"
                            url="/gov/org-request/"
                            text="Хүсэлт"
                            count={this.state.request_count}
                        >
                        </MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-database" url="/gov/org/map/" text="Дэд сан">
                            <ul className="sidebar-submenu">
                                {tuuhen_ov.perm_view &&
                                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/tuuhen-ov/" text="Түүхэн өв бүртгэл"></MenuItem>
                                }
                                {tseg_burtgel.perm_view &&
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
                                }
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/zip-code/" text="Зипкод"></MenuItem>
                                {org_inspire.length > 0 ? org_inspire.map((theme, idx) =>
                                    <MenuItem
                                        key={idx}
                                        icon="gp-text-primary fa fa-circle-o"
                                        url={`/gov/org/map/${theme.id}`}
                                        text={theme.name}
                                    >
                                        <ul className="sidebar-submenu">
                                            {
                                                theme.packages.length > 0 ? theme.packages.map((pack, idy) =>
                                                    <MenuItem
                                                        key={idy}
                                                        icon="fa fa-circle-o gp-text-primary"
                                                        url={`/gov/org/map/${theme.id}/${pack.id}`}
                                                        text={pack.name}
                                                    >
                                                        <ul className="sidebar-submenu">
                                                            {
                                                                pack.features.length > 0 ? pack.features.map((feat, idz) =>
                                                                    <MenuItem
                                                                        key={idz}
                                                                        icon="fa fa-circle-o gp-text-primary"
                                                                        url={`/gov/org/map/${theme.id}/${pack.id}/${feat.id}/`}
                                                                        text={feat.name}
                                                                        count={feat.count}
                                                                    >
                                                                    </MenuItem>
                                                                ) : null
                                                            }
                                                        </ul>
                                                    </MenuItem>
                                                ) : null
                                            }
                                        </ul>
                                    </MenuItem>
                                ) : null}
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/history/" text="Өөрчлөлтийн түүх"></MenuItem>
                            </ul>
                        </MenuItem>
                        <MenuItem icon="gp-text-primary zmdi zmdi-pin-help" url="/gov/help/" text="Тусламж"></MenuItem>
                    </ul>
                </div>

                <div className="clearfix">
                    <div className="content-wrapper">
                        <Switch>
                            {tseg_burtgel.perm_view ?
                                <Route path={"/gov/froms/"} component={() => <Forms perms={this.state.tseg_burtgel} />} /> : null
                            }
                            {tuuhen_ov.perm_view ?
                                <Route path="/gov/tuuhen-ov/" component={() => <TuuhenOv perms={this.state.tuuhen_ov} />} /> : null
                            }
                            <Route path="/gov/system/" component={System} />
                            <Route path="/gov/meta/" component={Meta} />

                            <Route path="/gov/perm/role/" component={(props) => <Role {...props} org_roles={org_role} /> } />
                            <Route path="/gov/role/role/" component={Role} />
                            <Route path="/gov/org/map/:tid/:pid/:fid/" component={(props) => <Bundles {...props} refreshCount={() => this.requestCount()} />} />

                            <Route path="/gov/zip-code/" component={ZipCode} />
                            <Route path="/gov/org-request/" component={OrgRequest} />
                            <Route path="/gov/history/" component={ChangeRequest} />
                            <Route exact path="/gov/perm/" component={(props) => <InsPerms {...props} org_roles={org_role}/>} />
                            <Route exact path="/gov/perm/org/" component={Gov} />
                            <Route path="/gov/perm/employee/" component={(props) => <Employee {...props} org_roles={org_role}/>} />
                            <Route exact path="/gov/help/" component={Help} />
                            <Route exact path="/gov/profile/" component={Profile} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
