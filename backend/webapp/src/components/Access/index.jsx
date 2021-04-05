import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {CrudEvenLog} from './CrudEvenLog/CrudEvenLog'
import {LoginLog} from './LoginLog/LoginLog'
import {PageLog} from './PageLog/PageLog'
import WMSLog from './WMSLog/WMSLog'


export default class Access extends Component {

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
                <ul className="nav nav-tabs nav-tabs-dark-gray nav-justified">
                  <li className="nav-item">
                    <NavLink to={"/back/access/login/"} activeClassName="active" className="nav-link"  data-toggle="tab">
                    <span className="hidden-xs">ОРОЛТ ГАРАЛТ</span>
                    </NavLink>
                  </li>
                  <li className="nav-item gp-text-primary">
                    <NavLink to={"/back/access/logout/"} activeClassName="active" className="nav-link"  data-toggle="tab">
                        <span className="hidden-xs">ҮЙЛДЭЛ</span>
                    </NavLink>
                  </li>
                  <li className="nav-item gp-text-primary">
                    <NavLink to={"/back/access/page/"} activeClassName="active" className="nav-link"  data-toggle="tab">
                        <span className="hidden-xs">ХУУДАС ХАНДАЛТ</span>
                    </NavLink>
                  </li>
                  <li className="nav-item gp-text-primary">
                    <NavLink to={"/back/access/wms-log/"} activeClassName="active" className="nav-link"  data-toggle="tab">
                        <span className="hidden-xs"> WMS LOG</span>
                    </NavLink>
                  </li>
                </ul>

                <div className="tab-content">
                    <Switch>
                        <Route path={"/back/access/login/"} component={LoginLog} />
                        <Route path={"/back/access/logout/"} component={CrudEvenLog} />
                        <Route path={"/back/access/page/"} component={PageLog} />
                        <Route path={"/back/access/wms-log/"} component={WMSLog} />
                    </Switch>
                </div>
              </div>
           </div>
        )

    }

}
