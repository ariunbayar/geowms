import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {OrgForm} from './OrgForm'
import {OrgAdd} from './OrgAdd'
import {OrgMenu} from './OrgMenu'


export class Org extends Component {

    constructor(props) {
        super(props)

        this.default_url = '/back/байгууллага/түвшин/1/'

        this.state = {
            user_count: 0,
        }

    }

    componentDidMount() {
        if (this.props.location.pathname.endsWith('түвшин/')) {
            this.props.history.push(this.default_url)
        }
    }

    componentDidUpdate() {
        if (this.props.location.pathname.endsWith('түвшин/')) {
            this.props.history.push(this.default_url)
        }
    }

    render() {
        const { user_count } = this.state;
        const org_level = this.props.match.params.level
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row mx-md-n3">
                    <div className="col-md-12">
                        <ul className="list-group list-group-horizontal col-md-12">
                            <NavLink to="/back/байгууллага/түвшин/1/" className="list-group-item col-md-3" activeClassName="text-white gp-bg-primary">
                                1-р түвшин
                            </NavLink>
                            <NavLink to="/back/байгууллага/түвшин/2/" className="list-group-item col-md-3" activeClassName="text-white gp-bg-primary">
                                2-р түвшин
                            </NavLink>
                            <NavLink to="/back/байгууллага/түвшин/3/" className="list-group-item col-md-3" activeClassName="text-white gp-bg-primary">
                                3-р түвшин
                            </NavLink>
                            <NavLink to="/back/байгууллага/түвшин/4/" className="list-group-item col-md-3" activeClassName="text-white gp-bg-primary">
                                4-р түвшин
                            </NavLink>
                        </ul>
                    </div>
                   
                </div>
                <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                <p className="btn gp-outline-primary">
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </p>
                            </NavLink>
               
                <div className="row">
                    <div className="col-md-12">
                        <Switch>
                            <Route exact path="/back/байгууллага/түвшин/:level/" component={OrgForm}/>
                            <Route exact path="/back/байгууллага/түвшин/:level/нэмэх/" component={OrgAdd} />
                            <Route exact path="/back/байгууллага/түвшин/:level/:id/засах/" component={OrgAdd}/>
                            <Route path="/back/байгууллага/түвшин/:level/:id/" component={OrgMenu}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
