import React, { Component, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import MenuItem from "@utils/MenuItem"
import SuspenseLoader from "@utils/Loader/SuspenseLoader"
import { DisplayNotif } from '@utils/Notification'
import DisplayModal from "@utils/Modal/DisplayModal"

const InsPerms  = React.lazy(() => import('./Role/Role/GovPerms'));
const Gov  = React.lazy(() => import('./Role/Gov/index'));
const OrgRequest  = React.lazy(() => import('./OrgRequest'));
const ChangeRequest  = React.lazy(() => import('./Bundles/Inspire/ChangeRequest'));
const Bundles  = React.lazy(() => import('./Bundles/Inspire'));

const System = React.lazy(() => import("./System"));
const Meta = React.lazy(() => import('./Meta'));
const RevokeRequest = React.lazy(() => import('./RevokeRequest'));
const Password = React.lazy(() => import('./User/Password'));
const Profile = React.lazy(() => import('./User/Profile'));
const Employee = React.lazy(() => import('./Role/Employee'));
const MapRegion = React.lazy(() => import('./Role/Region'));
const TuuhenOv = React.lazy(() => import('./Bundles/TuuhenOv'));
const Forms = React.lazy(() => import('./Bundles/Form'));
const ZipCode = React.lazy(() => import('./Bundles/Zipcode'));
const Addresses = React.lazy(() => import('./Role/EmployeeAddress'));
const Help = React.lazy(() => import('./Help'));
const Role = React.lazy(() => import('./Role'));
const Position = React.lazy(() => import('@helpComp/Position'));
const LLCRequest = React.lazy(() => import("./LLCRequest"));
const Tseg = React.lazy(() => import('./Bundles/TsegPersonal'));

import { service } from "./service"

export class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            org_level: props.org.org_level,
            name: props.org.name,
            map_list: [],
            base_layer_list: [],
            org_role: [],
            is_loading: true,
        }
        this.getModalFunc = this.getModalFunc.bind(this)
        this.getNotifFunc = this.getNotifFunc.bind(this)
    }

    getModalFunc(setModal) {
        global.MODAL = setModal
    }

    getNotifFunc(setNotif) {
        global.NOTIF = setNotif
    }

    getStates(org_perms, base_layer_list) {
        this.setState({ org_role: org_perms, base_layer_list, is_loading: false })
    }

    render() {
        const { employee, allowed_geom, has_position } = this.props.org
        const { base_layer_list, org_role, is_loading } = this.state

        return (
            <BrowserRouter>
                <SuspenseLoader is_loading={is_loading} color={'#000'} text="Эрхүүдийг уншиж байна."/>
                <DisplayModal getModalFunc={this.getModalFunc}/>
                <DisplayNotif getNotifFunc={this.getNotifFunc}/>
                <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
                    <div className="brand-logo">
                        <a href="/">
                            <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                            <h5 className="logo-text">ГЕОПОРТАЛ</h5>
                        </a>
                    </div>
                    <TabBars {...this.props.org} {...this.state} getStates={(...values) => this.getStates(...values)}/>
                </div>
                <div className="clearfix">
                    <div className="content-wrapper">
                        <ProfileMenu user={this.props.org.employee}/>
                        <Suspense fallback={<SuspenseLoader is_loading={true} text={"Хуудас ачааллаж байна."}/>}>
                            {
                                Object.keys(org_role).length > 0 && base_layer_list.length > 0
                                ?
                                    <Switch>
                                        <Route path={"/gov/forms/"} component={Forms} />
                                        <Route path="/gov/tuuhen-ov/" component={TuuhenOv} />

                                        <Route path={"/gov/tseg-personal/"} component={Tseg} />

                                        <Route path="/gov/system/" component={System} />
                                        <Route path="/gov/revoke-request/" component={RevokeRequest} />
                                        <Route path="/gov/llc-request/" component={LLCRequest} />
                                        <Route path="/gov/meta/" component={Meta} />

                                        <Route path="/gov/perm/position/" render={(props) => <Position {...props} is_admin={employee.is_admin} /> } />
                                        <Route path="/gov/perm/region/" render={(props) => <MapRegion {...props} allowed_geom={allowed_geom}/>} />
                                        <Route path="/gov/perm/role/" render={(props) => <Role {...props} org_roles={org_role} employee={employee}/> } />
                                        <Route path="/gov/role/role/" component={Role} />
                                        <Route
                                            path="/gov/org/map/:tid/:pid/:fid/"
                                            render={(props) =>
                                                <Bundles
                                                    {...props}
                                                    base_layer_list={base_layer_list}
                                                    employee={employee}
                                                    org_geom={allowed_geom}
                                                />
                                            }
                                        />
                                        <Route path="/gov/perm/addresses/" render={(props) => <Addresses {...props} employee={employee}/> } />
                                        <Route path="/gov/perm/erguuleg/" render={(props) => <Addresses {...props} employee={employee}/> } />
                                        <Route path="/gov/zip-code/" component={ZipCode} />
                                        <Route path="/gov/org-request/" component={OrgRequest} />
                                        <Route path="/gov/history/" component={ChangeRequest} />
                                        <Route exact path="/gov/perm/all/" render={(props) => <InsPerms {...props} org_roles={org_role} role_perm={org_role}/>} />
                                        <Route exact path="/gov/perm/org/" component={Gov} />
                                        <Route path="/gov/perm/employee/" render={(props) => <Employee {...props} org_roles={org_role} employee={employee} />}/>
                                        <Route exact path="/gov/help/" component={Help} />
                                        <Route exact path="/gov/profile/" component={Profile} />
                                        <Route exact path="/gov/profile/password/" component={Password} />
                                    </Switch>
                                :
                                    null
                            }
                        </Suspense>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

function ProfileMenu(props) {
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
                <NavLink className="dropdown-item" activeClassName="active" to="/gov/profile/"><i className="icon-lock mr-2"></i>ПРОФАЙЛ</NavLink>
                <div className="dropdown-divider"></div>
                    <a className="dropdown-item text-dark" href="/logout/"><i className="icon-power mr-2"></i>ГАРАХ</a>
                </div>
            </div>
        </div>
    )
}

function TabBars(props) {

    const employee = props.employee
    const { approve, revoke, has_position} = props

    const [request_count, setRequestCount] = useState(0)
    const [revoke_count, setRevokeCount] = useState(0)
    const [llc_count, setLLCCount] = useState(0)
    const [point_perms, setPointPerms] = useState([])
    const [emp_role, setEmpRole] = useState({})
    const [org_roles, setOrgPerms] = useState([])
    const [base_layer_list, setBaseLayer] = useState([])

    useEffect(() => {
        if (Object.keys(org_roles).length > 0 && base_layer_list.length > 0) {
            props.getStates(org_roles, base_layer_list)
        }

    }, [org_roles, base_layer_list])

    useEffect(() => {
        Promise.all([
            requestCount(),
            getPerms(),
            getBaseLayer(),
        ])
        global.refreshCount = requestCount
    }, [])

    const requestCount = () => {
        // service.component
        service.getCount()
            .then(({ success, count, revoke_count, llc_count, info }) => {
                if (success) {
                    setRequestCount(count)
                    setRevokeCount(revoke_count)
                    setLLCCount(llc_count)
                } else {
                    // TODO
                }
            })
    }

    const getPerms = async () => {
        const { success, data, error } = await service.getPerms()
        if (success) {
            setOrgPerms(data.org_role)
            setEmpRole(data.emp_role)
            setPointPerms(data.emp_role.point_perms)
        }
    }

    const getBaseLayer = () => {
        service.loadBaseLayers()
            .then(({ base_layer_list }) => {
                setBaseLayer(base_layer_list)
            })
    }

    return (
        <ul className="sidebar-menu do-nicescrol">
            <MenuItem icon="gp-text-primary fa fa-key" url="#" text="Байгууллага">
                <ul className="sidebar-submenu">
                    {
                        employee.is_admin
                        &&
                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/all/" text="Эрхүүд"></MenuItem>
                    }
                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/region/" text="Хамрах хүрээ"></MenuItem>
                    {
                        employee.is_admin
                        &&
                            <>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/role/" text="Дүрийн тохиргоо"></MenuItem>
                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/position/" text="Албан тушаал"></MenuItem>
                            </>
                    }
                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/employee/" text="Хэрэглэгч"></MenuItem>
                    {
                        employee.is_admin
                        &&
                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/addresses/" text={"Ажилчдын хаяг"}></MenuItem>
                    }
                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/perm/erguuleg/" text={"Эргүүлийн мэдээлэл"}></MenuItem>
                </ul>
            </MenuItem>
            <MenuItem icon="gp-text-primary fa fa-link" url="/gov/system/" text="Систем"></MenuItem>
            <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/meta/" text="Мета"></MenuItem>

            { revoke &&
                <MenuItem
                    icon="gp-text-primary fa fa-times-circle"
                    url="/gov/revoke-request/"
                    text="Цуцлах хүсэлт"
                    count={revoke_count}
                ></MenuItem>
            }
            { approve &&
                <MenuItem
                    icon="gp-text-primary fa fa-plug"
                    url="/gov/org-request/"
                    text="Хүсэлт"
                    count={request_count}
                >
                </MenuItem>
            }
            {
                has_position && <MenuItem icon="gp-text-primary fa fa-plug" url="/gov/llc-request/" text="ААН-Хүсэлт" count={llc_count}></MenuItem>
            }
            <MenuItem icon="gp-text-primary fa fa-database" url="/gov/org/map/" text="Дэд сан">
                <ul className="sidebar-submenu">
                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/tuuhen-ov/" text="Түүхэн өв бүртгэл"></MenuItem>
                    {
                        point_perms && point_perms.PERM_VIEW &&
                        <MenuItem
                            icon="gp-text-primary fa fa-circle-o"
                            url="/gov/froms/tseg-info/tsegpersonal/"
                            text="Цэгийн мэдээлэл"
                        >
                        <ul className="sidebar-submenu">
                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/forms/tseg-info/tsegpersonal/tseg-personal/" text="Шинэ цэг"></MenuItem>
                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/" text="Цэг устгах"></MenuItem>
                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/forms/tseg-info/tsegpersonal/inspire-tseg/" text="Цэгийн жагсаалт"></MenuItem>
                        </ul>
                    </MenuItem>
                    }
                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/zip-code/" text="Зипкод"></MenuItem>
                    {
                        emp_role?.themes && Object.keys(emp_role.themes).length > 0
                        ?
                            emp_role.themes.map((theme, idx) =>
                                <MenuItem
                                    key={idx}
                                    icon="gp-text-primary fa fa-circle-o"
                                    url={`/gov/org/map/${theme.id}`}
                                    text={theme.name}
                                >
                                    <ul className="sidebar-submenu">
                                        {
                                            Object.keys(emp_role.package_features).length > 0
                                            ?
                                                emp_role.package_features.map((pack, idy) =>
                                                    theme.id == pack.parent_id
                                                    ?
                                                        <MenuItem
                                                            key={idy}
                                                            icon="fa fa-circle-o gp-text-primary"
                                                            url={`/gov/org/map/${theme.id}/${pack.id}`}
                                                            text={pack.name}
                                                        >
                                                            <ul className="sidebar-submenu">
                                                                {
                                                                    Object.keys(pack.features).length > 0
                                                                    ?
                                                                        pack.features.map((feat, idz) =>
                                                                            <MenuItem
                                                                                key={idz}
                                                                                icon="fa fa-circle-o gp-text-primary"
                                                                                url={`/gov/org/map/${theme.id}/${pack.id}/${feat.id}/`}
                                                                                text={feat.name}
                                                                                count={feat.count}
                                                                            >
                                                                            </MenuItem>
                                                                        )
                                                                    :
                                                                        null
                                                                }
                                                            </ul>
                                                        </MenuItem>
                                                    :
                                                        null
                                                )
                                            :
                                                null
                                        }
                                    </ul>
                                </MenuItem>
                            )
                        :
                            null
                    }
                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/history/" text="Өөрчлөлтийн түүх"></MenuItem>
                </ul>
            </MenuItem>
            <MenuItem icon="gp-text-primary zmdi zmdi-pin-help" url="/gov/help/" text="Тусламж"></MenuItem>
        </ul>
    );
}
