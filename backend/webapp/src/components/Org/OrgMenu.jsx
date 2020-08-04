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
            user_count: 0,
            org_name:''
        }
        this.userCount=this.userCount.bind(this)
        this.GetOrgName=this.GetOrgName.bind(this)

    }

    componentDidMount() {
        const level=this.props.match.params.level
        const id=this.props.match.params.id
        this.GetOrgName(level,id)
    }

    userCount() {

    }
    GetOrgName(org_level,id){
        service.OrgAll(org_level,id).then(({ orgs }) => {
            if (orgs) {
                orgs.map(org=>this.setState({
                    org_name:org.name
                }))
            }
        })
    }

    render() {
        const { user_count, org_name} = this.state
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="">
                <div className="row">
                    <div className=" col-md-2">
                        <div className="container my-4">
                            <div className="list-group">
                                <NavLink className="menu" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/эрх/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                        Эрх
                                    </div>
                                </NavLink>
                                <NavLink className="menu" exact to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                        Хэрэглэгч
                                    </div>
                                </NavLink>
                                <NavLink className="menu" exact to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                        Систем
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                        <div className="col-md-10">
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
