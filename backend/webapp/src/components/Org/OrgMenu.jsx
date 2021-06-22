import React, { Component, useState, useEffect } from "react"
import {Switch , Route, Link, NavLink} from "react-router-dom"

import {service} from './service'
import {OrgForm} from './OrgDetail/OrgForm'
import {OrgSystem} from './OrgSystem'
import {OrgUser} from './OrgUser'
import {OrgRole} from './OrgRole'
import {Addresses} from './OrgUsersAddress'
import {Graph} from './OrgGraph'
import Position from "@helpComp/Position"

export class OrgMenu extends Component {

    constructor(props) {

        super(props)
        this.state = {
            level: this.props.match.params.level,
            id: this.props.match.params.id,
            org_name: '',
            sistem_count: 0,
            employee_count: null,
            is_superuser: true, // default value
            refreshOrgCount: null,
            refreshSystemCount: null,
            allowed_geom: null,
        }
        this.getOrgName = this.getOrgName.bind(this)

    }

    getOrgName(refreshOrg, refreshSystemCount, allowed_geom) {
        this.setState({ refreshOrgCount: refreshOrg, refreshSystemCount, allowed_geom })
    }

    render() {
        const { allowed_geom, is_superuser, refreshOrgCount, refreshSystemCount } = this.state
        return (
            <div>
                <div className="tab-content">
                    <OrgTabs getOrgName={this.getOrgName} {...this.props} {...this.state}/>
                    {
                        refreshOrgCount && refreshSystemCount
                        &&
                            <Switch>
                                <Route path="/back/байгууллага/түвшин/:level/:id/detail/" render={(routeProps) =>
                                    <OrgForm { ...routeProps } allowed_geom={allowed_geom} refresh={ refreshOrgCount }/>
                                }/>
                                <Route path="/back/байгууллага/түвшин/:level/:id/эрх/" component={OrgRole}/>
                                <Route
                                    path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/"
                                    component={(props) =>
                                        <OrgUser {...props} refreshCount={refreshOrgCount}/>
                                    }
                                />
                                <Route
                                    path="/back/байгууллага/түвшин/:level/:id/систем/" component={OrgSystem}
                                    component={(props) =>
                                        <OrgSystem {...props} refreshCount={this.handleSistemCount}/>
                                    }
                                />
                                <Route
                                    path="/back/байгууллага/түвшин/:level/:id/addresses/"
                                    component={Addresses}
                                />
                                <Route
                                    path="/back/байгууллага/түвшин/:level/:id/graph/"
                                    component={Graph}
                                />
                                <Route
                                    path="/back/байгууллага/түвшин/:level/:id/position/" component={Position}
                                    component={(props) =>
                                        <Position {...props} is_superuser={is_superuser} />
                                    }
                                />
                            </Switch>
                    }
                </div>
            </div>
        )
    }
}

function OrgTabs(props) {

    const org_level = props.match.params.level
    const org_id = props.match.params.id

    const [employee_count, setEmployeeCount] = useState(props.employee_count)
    const [org_name, setOrgName] = useState(props.org_name)
    const [system_count, setSystemCount] = useState(0)

    useEffect(() => {
        Promise.all([
            handleSistemCount(),
            getOrgName(org_level),
        ])
    }, [])

    const handleSistemCount = () => {
        service
            .sistemCount(org_id)
            .then(({ count }) => {
                setSystemCount(count)
            })
    }

    const getOrgName = (org_level) => {
        service.orgAll(org_level, org_id).then(({ orgs, count }) => {
            if (orgs) {
                orgs.map(org => {
                    setOrgName(org.name)
                    props.getOrgName(getOrgName, handleSistemCount, org.allowed_geom)
                })
                setEmployeeCount(count)
            }
        })
    }

    return (
        <div className="mb-3">
            <ul className="nav nav-tabs nav-tabs-dark-gray">
                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/detail/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="fa fa-th-large"></i>
                        <span className="hidden-xs"></span>
                    </NavLink>
                </li>

                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/эрх/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="fa fa-lock"></i>
                        <span className="hidden-xs"> Эрх</span>
                    </NavLink>
                </li>

                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="icon-user"></i>
                        <span className="hidden-xs"> Албан хаагчид</span>
                        <small className="badge float-right badge-dark-primary ml-2">{ employee_count }</small>
                    </NavLink>
                </li>

                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="icon-envelope-open"></i>
                        <span className="hidden-xs"> Систем</span>
                        <small className="badge float-right badge-dark-primary ml-2">{system_count}</small>
                    </NavLink>
                </li>

                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/addresses/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="fa fa-map-marker"></i>
                        <span className="hidden-xs"> Ажилчдын хаяг</span>
                    </NavLink>
                </li>

                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/graph/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="fa fa-bar-chart" aria-hidden="true"/>
                        <span className="hidden-xs"> График мэдээлэл</span>
                    </NavLink>
                </li>

                <li className="nav-item gp-text-primary">
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/position/`}
                        className="nav-link"
                        activeClassName="active"
                        data-toggle="tab"
                    >
                        <i className="fa fa-bar-chart" aria-hidden="true"/>
                        <span className="hidden-xs">Албан тушаал</span>
                    </NavLink>
                </li>
            </ul>
            <a className="geo-back-btn" id='geo-back-btn' onClick={props.history.goBack}>
                <small className="fa fa-chevron-circle-left"> {org_name}</small>
            </a>
        </div>
    )
}
