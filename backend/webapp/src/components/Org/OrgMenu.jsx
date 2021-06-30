import React, { Component, useState, useEffect } from "react"
import {Switch , Route, Link, NavLink} from "react-router-dom"

import Loader from "@utils/Loader"

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
            prefix: '/back/байгууллага/түвшин',
            org_name: '',
            sistem_count: 0,
            employee_count: null,
            is_superuser: true, // default value
            allow_geom: null,
            is_loading: true,
        }
        this.getGeom = this.getGeom.bind(this)
    }

    getGeom(allow_geom) {
        this.setState({ allow_geom, is_loading: false })
    }

    render() {
        const { is_superuser, prefix, allow_geom, is_loading } = this.state
        return (
            <div>
                <Loader is_loading={is_loading}/>
                <div className="tab-content">
                    <OrgTabs {...this.props} {...this.state} setGeom={this.getGeom}/>
                    {
                        allow_geom
                        ?
                            <div>
                                <Switch>
                                    <Route path={`${prefix}/:level/:id/detail/`} render={(routeProps) => <OrgForm {...routeProps} allow_geom={allow_geom}/>}/>
                                    <Route path={`${prefix}/:level/:id/эрх/`} component={OrgRole}/>
                                    <Route path={`${prefix}/:level/:id/хэрэглэгч/`} component={OrgUser} />
                                    <Route path={`${prefix}/:level/:id/систем/`} component={OrgSystem} />
                                    <Route path={`${prefix}/:level/:id/addresses/`} component={Addresses}/>
                                    <Route path={`${prefix}/:level/:id/graph/`} component={Graph} />
                                    <Route path={`${prefix}/:level/:id/position/`}
                                        render={(props) =>
                                            <Position {...props} is_superuser={is_superuser} />
                                        }
                                    />
                                </Switch>
                            </div>
                        :
                            null
                    }
                </div>
            </div>
        )
    }
}

function OrgTabs(props) {

    const org_level = props.match.params.level
    const org_id = props.match.params.id
    const prefix = `${props.prefix}/${org_level}/${org_id}`

    const [employee_count, setEmployeeCount] = useState(0)
    const [org_name, setOrgName] = useState('')
    const [system_count, setSystemCount] = useState(0)
    const [pos_count, setPosCount] = useState(0)

    const nav_bars = [
        {
            link: `${prefix}/detail/`,
            icon: 'fa fa-th-large',
            text: ''
        },
        {
            link: `${prefix}/эрх/`,
            icon: 'fa fa-lock',
            text: 'Эрх'
        },
        {
            link: `${prefix}/хэрэглэгч/`,
            icon: 'icon-user',
            text: 'Албан хаагчид',
            count: employee_count,
        },
        {
            link: `${prefix}/систем/`,
            icon: 'icon-envelope-open',
            text: 'Систем',
            count: system_count,
        },
        {
            link: `${prefix}/addresses/`,
            icon: 'fa fa-map-marker',
            text: 'Ажилчдын хаяг',
        },
        {
            link: `${prefix}/graph/`,
            icon: 'fa fa-bar-chart',
            text: 'График мэдээлэл',
        },
        {
            link: `${prefix}/position/`,
            icon: 'fa fa-shopping-bag',
            text: 'Албан тушаал',
            count: pos_count,
        },
    ]

    useEffect(() => {
        Promise.all([
            handleSistemCount(),
            getOrgName(org_level),
        ])
        global.refreshOrgCount = getOrgName
        global.refreshSystemCount = handleSistemCount
    }, [])

    const handleSistemCount = () => {
        service
            .sistemCount(org_id)
            .then(({ count }) => {
                setSystemCount(count)
            })
    }

    const getOrgName = (org_level) => {
        service
            .orgAll(org_level, org_id)
            .then(({ orgs, count, pos_count }) => {
                if (orgs) {
                    orgs.map(org => {
                        setOrgName(org.name)
                        props.setGeom(org.allowed_geom)
                    })
                    setEmployeeCount(count)
                    setPosCount(pos_count)
                }
            })
    }

    return (
        <div className="mb-3">
            <ul className="nav nav-tabs nav-tabs-dark-gray">
                {
                    nav_bars.map((bar, idx) =>
                        <li className="nav-item gp-text-primary" key={idx}>
                            <NavLink to={bar.link}
                                className="nav-link"
                                activeClassName="active"
                                data-toggle="tab"
                            >
                                <i className={bar.icon}></i>
                                <span className="hidden-xs"> {bar.text}</span>
                                {
                                    bar?.count >= 0
                                    ?
                                        <small className="badge float-right badge-dark-primary ml-2">{bar.count}</small>
                                    :
                                        null
                                }
                            </NavLink>
                        </li>
                    )
                }
            </ul>
            <a className="geo-back-btn" id='geo-back-btn' onClick={props.history.goBack}>
                <small className="fa fa-chevron-circle-left"> {org_name}</small>
            </a>
        </div>
    )
}
