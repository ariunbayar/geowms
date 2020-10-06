import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import Modal from "../../../src/components/Modal/DeleteModal"
import Жагсаалт from "./Жагсаалт"
import Маягт from "./Маягт"
import Map from "./Map"

export default class Index extends Component {

    render() {
        const oid = this.props.match.params.oid
        return (
            <div className="card">
              <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-primary nav-justified">
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/gov/барилга-суурин-газар/${oid}/`} activeClassName="nav-link active"  data-toggle="tab">
                            <span className="hidden-xs gp-text-primary">MAP</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={`/gov/барилга-суурин-газар/${oid}/жагсаалт/`} activeClassName="nav-link active"  data-toggle="tab">
                            <span className="hidden-xs gp-text-primary">ЖАГСААЛТ</span>
                        </NavLink>
                    </li>
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/gov/барилга-суурин-газар/${oid}/маягт/`} activeClassName="nav-link active"  data-toggle="tab">
                            <span className="hidden-xs gp-text-primary">МАЯГТ</span>
                        </NavLink>
                    </li>
                </ul>

                <div className="tab-content">
                    <Switch>
                        <Route path={`/gov/барилга-суурин-газар/:oid/жагсаалт/`} component={Жагсаалт} />
                        <Route path={`/gov/барилга-суурин-газар/:oid/маягт/`} component={Маягт} />
                        <Route path={`/gov/барилга-суурин-газар/:oid/`} component={Map} />
                    </Switch>
                </div>
              </div>
           </div>
        )
    }
}
