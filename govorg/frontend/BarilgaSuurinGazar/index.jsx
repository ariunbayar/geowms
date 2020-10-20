import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import Жагсаалт from "./Жагсаалт"
import Маягт from "./Маягт"
import Map from "./Map"

import Modal from "../../../src/components/Modal/DeleteModal"
import {Notif} from '../../../src/components/Notification/index'

export default class Index extends Component {

    constructor(props){
        super(props)
        this.too = 0
        this.state = {
            show: false
        }
        this.addNotif = this.addNotif.bind(this)
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style: style, msg: msg, icon: icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    render() {

        const { fields } = this.props
        const pid = this.props.match.params.pid
        const fid = this.props.match.params.fid

        return (
            <div className="card">
            <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
              <div className="card-body">

                <ul className="nav nav-tabs nav-tabs-primary">
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/gov/барилга-суурин-газар/${pid}/${fid}/map/`} exact className="nav-link" activeClassName="active">
                            <i className="fa fa-map"></i> {}
                            <span className="hidden-xs">Газрын зургаар</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={`/gov/барилга-суурин-газар/${pid}/${fid}/жагсаалт/`} className="nav-link" activeClassName="active">
                            <i className="fa fa-table"></i> {}
                            <span className="hidden-xs">Хүснэгтээр</span>
                        </NavLink>
                    </li>
                    <li className="nav-item gp-text-primary">
                        <NavLink to={`/gov/барилга-суурин-газар/${pid}/${fid}/маягт/шинэ/`} className="nav-link" activeClassName="active">
                            <i className="fa fa-edit"></i> {}
                            <span className="hidden-xs">Өөрчлөлт</span>
                        </NavLink>
                    </li>
                </ul>

                <div className="tab-content">
                    <Switch>
                        <Route path="/gov/барилга-суурин-газар/:pid/:fid/жагсаалт/" render={(routeProps) =>
                            <Жагсаалт { ...routeProps } fields={ fields }/>
                        }/>

                        <Route path="/gov/барилга-суурин-газар/:pid/:fid/маягт/шинэ/" render={(routeProps) =>
                            <Маягт { ...routeProps } fields={ fields }/>
                        }/>

                        <Route path="/gov/барилга-суурин-газар/:pid/:fid/маягт/:id/засах/" render={(routeProps) =>
                            <Маягт { ...routeProps } fields={ fields }/>
                        }/>

                        <Route path="/gov/барилга-суурин-газар/:pid/:fid/map/" render={(routeProps) =>
                            <Map { ...routeProps } fields={ fields } addNotif={ this.addNotif } />
                        }/>

                    </Switch>
                </div>
              </div>
           </div>
        )
    }
}
