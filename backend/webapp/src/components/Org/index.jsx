import React, { Component } from "react"
import {Switch , Route, Link, NavLink} from "react-router-dom"
import {OrgForm} from './OrgForm'
import {OrgAdd} from './OrgAdd'
import {OrgMenu} from './OrgMenu'

export class Org extends Component {
    constructor(props) {

        super(props)

        this.state = {
            user_count: 0,
        }

    }

    componentDidMount() {

    }

    render() {
        const { user_count} = this.state
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                        <div className="col-md-12 list-group list-group-horizontal">
                            <NavLink className="nav-link col-md-3" to="/back/байгууллага/түвшин/1/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    1-р түвшин
                                </div>
                            </NavLink>
                            <NavLink className="nav-link col-md-3" to="/back/байгууллага/түвшин/2/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    2-р түвшин
                                </div>
                            </NavLink>
                            <NavLink className="nav-link col-md-3" to="/back/байгууллага/түвшин/3/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    3-р түвшин
                                </div>
                            </NavLink>
                            <NavLink className="nav-link col-md-3" to="/back/байгууллага/түвшин/4/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    4-р түвшин
                                </div>
                            </NavLink>
                        </div>
                </div>
                <div className="row">
                        <div className="col-md-12">
                            <Switch>
                                <Route exact path="/back/байгууллага/түвшин/:level/" component={OrgForm}/>
                                <Route  exact path="/back/байгууллага/түвшин/:level/нэмэх/" component={OrgAdd}/>
                                <Route path="/back/байгууллага/түвшин/:level/:id/" component={OrgMenu}/>
                            </Switch>
                        </div>
                </div>
            </div>
        )
    }
}
