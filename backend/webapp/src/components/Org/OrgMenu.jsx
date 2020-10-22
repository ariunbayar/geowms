import React, { Component } from "react"
import {service} from './service'
import {Switch , Route, Link, NavLink} from "react-router-dom"
import {OrgForm} from './OrgForm'
import {OrgRole} from './OrgRole'
import {OrgSystem} from './OrgSystem'
import {OrgUser} from './OrgUser'


export class OrgMenu extends Component {
    constructor(props) {

        super(props)
        this.state = {
            org_name:'',
            sistem_count: 0,
            employee_count:null,
        }
        this.getOrgName=this.getOrgName.bind(this)
        this.handleSistemCount=this.handleSistemCount.bind(this)

    }
    componentDidMount() {
        const level=this.props.match.params.level
        const id=this.props.match.params.id
        this.getOrgName(level,id)
        this.handleSistemCount()
    }

    handleSistemCount(){
        const id=this.props.match.params.id
        service.sistemCount(id).then(({ count }) => {
            this.setState({ sistem_count: count });
          });
    }

    getOrgName(org_level,id){
        service.orgAll(org_level,id).then(({ orgs,count }) => {
            if (orgs) {
                orgs.map(org=>this.setState({
                    org_name:org.name
                }))
                this.setState({
                    employee_count:count
                })
            }
        })
    }

    render() {
        const { org_name} = this.state
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="card">
              <div className="card-body">
              <ul className="nav nav-tabs nav-tabs-primary nav-justified">
                            <li className="nav-item">
                                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/эрх/`}
                                    activeClassName="active nav-link"  data-toggle="tab">
                                        <i className="icon-home"></i> <span className="hidden-xs">Эрх</span>
                                    </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`}
                                activeClassName="active nav-link"  data-toggle="tab">
                                    <i className="icon-user"></i> <span className="hidden-xs">Албан хаагчид</span></NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`}
                                activeClassName="active nav-link"  data-toggle="tab"><i className="icon-envelope-open">
                                    </i> <span className="hidden-xs">Систем</span></NavLink>
                            </li>
                        </ul>
                        <div className="tab-content">
                        <Switch>
                            <Route path="/back/байгууллага/түвшин/:level/:id/эрх/" component={OrgRole}/>
                            <Route path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/" component={OrgUser}/>
                            <Route path="/back/байгууллага/түвшин/:level/:id/систем/" component={OrgSystem}/>
                        </Switch>
                        </div>
                    </div>
                </div>
        )
    }
}