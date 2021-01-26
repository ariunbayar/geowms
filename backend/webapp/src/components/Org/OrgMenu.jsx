import React, { Component } from "react"
import {Switch , Route, Link, NavLink} from "react-router-dom"

import {service} from './service'
import {OrgDetail} from './OrgDetail'
import {OrgSystem} from './OrgSystem'
import {OrgUser} from './OrgUser'
import {OrgRole} from './OrgRole'


export class OrgMenu extends Component {

    constructor(props) {

        super(props)
        this.state = {
            org_name: '',
            allowed_geom: null,
            sistem_count: 0,
            employee_count: null,
        }
        this.getOrgName = this.getOrgName.bind(this)
        this.handleSistemCount = this.handleSistemCount.bind(this)

    }

    componentDidMount() {
        const level= this.props.match.params.level
        const id= this.props.match.params.id
        this.getOrgName(level, id)
        this.handleSistemCount()
    }

    handleSistemCount(){

        const id = this.props.match.params.id

        service.sistemCount(id).then(({ count }) => {
            this.setState({ sistem_count: count })
        })
    }

    getOrgName(org_level,id){
        service.orgAll(org_level,id).then(({ orgs, count }) => {
            if (orgs) {
                orgs.map(org => this.setState({
                    org_name: org.name,
                    allowed_geom: org.allowed_geom,
                }))
                this.setState({
                    employee_count: count
                })
            }
        })
    }

    render() {
        const { org_name, employee_count, allowed_geom } = this.state
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div>
                <ul className="nav nav-tabs nav-tabs-dark-gray">

                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/detail/`} className="nav-link"
                            activeClassName="active"  data-toggle="tab">
                            <i className="fa fa-th-large"></i> <span className="hidden-xs"></span>
                        </NavLink>
                    </li>
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/org-role/`} className="nav-link"
                            activeClassName="active"  data-toggle="tab">
                            <i className="fa fa-lock"></i> <span className="hidden-xs">Эрх</span>
                        </NavLink>
                    </li>
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`} className="nav-link"
                            activeClassName="active"  data-toggle="tab">
                            <i className="icon-user"></i> <span className="hidden-xs">Албан хаагчид</span>
                            <small className="badge float-right badge-dark-primary ml-2">{ employee_count }</small>
                        </NavLink>
                    </li>
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`} className="nav-link"
                                activeClassName="active"  data-toggle="tab"><i className="icon-envelope-open">
                        </i> <span className="hidden-xs">Систем</span>
                        <small className="badge float-right badge-dark-primary ml-2">{this.state.sistem_count}</small>

                        </NavLink>
                    </li>
                </ul>
                <div className="tab-content">
                    <Switch>
                        <Route path="/back/байгууллага/түвшин/:level/:id/detail/" render={(routeProps) =>
                            <OrgDetail { ...routeProps } allowed_geom={ allowed_geom }/>
                        }/>
                        <Route path="/back/байгууллага/түвшин/:level/:id/org-role/" component={OrgRole}/>
                        <Route path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/" component={OrgUser}/>
                        <Route path="/back/байгууллага/түвшин/:level/:id/систем/" component={OrgSystem}/>
                    </Switch>
                </div>
                <a className="geo-back-btn" id='geo-back-btn' onClick={this.props.history.goBack}>
                    <small className="fa fa-chevron-circle-left"> {org_name}</small>
                </a>
            </div>
        )
    }
}
