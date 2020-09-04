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
                    <div className="col-md-2 pr-0 pl-0">
                        <div className="container pr-0">
                            <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                <p className="btn  mt-2 gp-outline-primary">
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </p>
                            </NavLink>
                            <div className="list-group mt-lg-5">
                                <NavLink className="menu" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/эрх/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                        Эрх
                                    </div>
                                </NavLink>
                                <NavLink className="menu" exact to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                        Албан хаагчид<span className="badge badge-primary badge-pill">{this.state.employee_count}</span>
                                    </div>
                                </NavLink>
                                <NavLink className="menu" exact to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                        Систем<span className="badge badge-primary badge-pill">{this.state.sistem_count}</span>
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                        <div className="col-md-10 pl-0">
                        <div className="text-center mt-4">
                            <h3 className="text-dark">{org_name}</h3>
                        </div>
                            <Switch>
                                <Route path="/back/байгууллага/түвшин/:level/:id/эрх/" component={OrgRole}/>
                                <Route path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/" component={OrgUser}/>
                                <Route path="/back/байгууллага/түвшин/:level/:id/систем/" component={OrgSystem}/>
                            </Switch>
                        </div>
                </div>
        )
    }
}