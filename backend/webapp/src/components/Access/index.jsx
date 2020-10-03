import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {CrudEvenLog} from './CrudEvenLog/CrudEvenLog'
import {LoginLog} from './LoginLog/LoginLog'
import {PageLog} from './PageLog/PageLog'


export class Access extends Component {

    constructor(props) {
        super(props)

        // this.default_url = '/back/access/login/'

    }

    componentDidMount() {
        if (this.props.location.pathname.endsWith('access/')) {
            this.props.history.push(this.default_url)
        }
    }

    componentDidUpdate() {
        if (this.props.location.pathname.endsWith('access/')) {
            this.props.history.push(this.default_url)
        }
    }

    render() {

        return (
            <div className="card">
              <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-primary nav-justified">
                  <li className="nav-item">
                    <NavLink to={"/back/access/login/"} activeClassName="nav-link active"  data-toggle="tab">
                    <span className="hidden-xs gp-text-primary">ОРОЛТ ГАРАЛТ</span>
                    </NavLink>
                  </li>
                  <li className="nav-item gp-text-primary">
                    <NavLink to={"/back/access/logout/"} activeClassName="nav-link active"  data-toggle="tab">
                        <span className="hidden-xs gp-text-primary">ҮЙЛДЭЛ</span>
                    </NavLink>
                  </li>
                  <li className="nav-item gp-text-primary">
                    <NavLink to={"/back/access/page/"} activeClassName="nav-link active"  data-toggle="tab">
                        <span className="hidden-xs gp-text-primary">ХУУДАС ХАНДАЛТ</span>
                    </NavLink>
                  </li>
                </ul>

                <div className="tab-content">
                    <Switch>
                        <Route path={"/back/access/login/"} component={LoginLog} />
                        <Route path={"/back/access/logout/"} component={CrudEvenLog} />
                        <Route path={"/back/access/page/"} component={PageLog} />
                    </Switch>
                </div>
              </div>
           </div>
        )

    }

}
