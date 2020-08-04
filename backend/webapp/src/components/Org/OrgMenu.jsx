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
        }
        this.userCount=this.userCount.bind(this)

    }

    componentDidMount() {
        this.userCount()
    }

    userCount() {
    }

    render() {
        const { user_count} = this.state
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
