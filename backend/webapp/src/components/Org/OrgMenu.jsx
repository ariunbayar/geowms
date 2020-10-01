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
                <div className="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <ul class="nav nav-tabs nav-tabs-dark nav-justified">
                                    <li class="nav-item">
                                            <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/эрх/`} activeClassName="active nav-link"  data-toggle="tab"><i class="icon-home"></i> <span class="hidden-xs">Эрх</span></NavLink>
                                    </li>
                                    <li class="nav-item">
                                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`} activeClassName="active nav-link"  data-toggle="tab"><i class="icon-user"></i> <span class="hidden-xs">Албан хаагчид</span><small className="badge float-right badge-info">{this.state.employee_count}</small></NavLink>
                                    </li>
                                    <li class="nav-item">
                                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`} activeClassName="active nav-link"  data-toggle="tab"><i class="icon-envelope-open"></i> <span class="hidden-xs">Систем</span><small className="badge float-right badge-info">{this.state.sistem_count}</small></NavLink>
                                    </li>
                                </ul>
                                <div class="tab-content">
                                <Switch>
                                    <Route path="/back/байгууллага/түвшин/:level/:id/эрх/" component={OrgRole}/>
                                    <Route path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/" component={OrgUser}/>
                                    <Route path="/back/байгууллага/түвшин/:level/:id/систем/" component={OrgSystem}/>
                                </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}