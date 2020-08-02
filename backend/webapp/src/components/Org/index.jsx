import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {OrgForm} from './OrgForm'
import {OrgAdd} from './OrgAdd'
import {OrgMenu} from './OrgMenu'


const NavLinkLi = ({to, exact, children, className, activeClassName}) => {
    // Credits to: https://stackoverflow.com/a/43232627/592309
    const navLinkLi = ({match}) => {
        return (
            <li className={className + (match ? ' ' + activeClassName : '')}>
                <Link to={to}>{children}</Link>
            </li>
        )
    }

    return (
        <Route
            path={typeof to === 'object' ? to.pathname : to}
            exact={exact}
            strict={false}
            children={navLinkLi}
        />
    )
}


export class Org extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user_count: 0,
        }

    }

    render() {
        const { user_count} = this.state
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div class="col-md-12">
                        <ul className="list-group list-group-horizontal">
                            <NavLinkLi exact to="/back/байгууллага/түвшин/1/" className="list-group-item" activeClassName="active">
                                1-р түвшин
                            </NavLinkLi>
                            <NavLinkLi exact to="/back/байгууллага/түвшин/2/" className="list-group-item" activeClassName="active">
                                2-р түвшин
                            </NavLinkLi>
                            <NavLinkLi exact to="/back/байгууллага/түвшин/3/" className="list-group-item" activeClassName="active">
                                3-р түвшин
                            </NavLinkLi>
                            <NavLinkLi exact to="/back/байгууллага/түвшин/4/" className="list-group-item" activeClassName="active">
                                4-р түвшин
                            </NavLinkLi>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Switch>
                            <Route exact path="/back/байгууллага/түвшин/:level/" component={OrgForm}/>
                            <Route exact path="/back/байгууллага/түвшин/:level/нэмэх/" component={OrgAdd}/>
                            <Route path="/back/байгууллага/түвшин/:level/:id/" component={OrgMenu}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
