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

                <ul className="nav nav-tabs nav-tabs-primary">
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/gov/барилга-суурин-газар/${oid}/`} exact className="nav-link" activeClassName="active">
                            <i className="fa fa-map"></i> {}
                            <span className="hidden-xs">Газрын зургаар</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={`/gov/барилга-суурин-газар/${oid}/жагсаалт/`} className="nav-link" activeClassName="active">
                            <i className="fa fa-table"></i> {}
                            <span className="hidden-xs">Хүснэгтээр</span>
                        </NavLink>
                    </li>
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/gov/барилга-суурин-газар/${oid}/маягт/шинэ/`} className="nav-link" activeClassName="active">
                            <i className="fa fa-edit"></i> {}
                            <span className="hidden-xs">Өөрчлөлт</span>
                        </NavLink>
                    </li>
                </ul>

                <div className="tab-content">
                    <Switch>
                        <Route path="/gov/барилга-суурин-газар/:oid/жагсаалт/" component={Жагсаалт} />
                        <Route path="/gov/барилга-суурин-газар/:oid/маягт/шинэ/" component={Маягт} />
                        <Route path="/gov/барилга-суурин-газар/:oid/маягт/:id/засах/" component={Маягт} />
                        <Route path="/gov/барилга-суурин-газар/:oid/" component={Map} />
                    </Switch>
                </div>
              </div>
           </div>
        )
    }
}
