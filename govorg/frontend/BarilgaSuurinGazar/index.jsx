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
    componentDidMount(){
        const {pid, fid} = this.props.match.params
        this.props.history.push(`/gov/барилга-суурин-газар/${pid}/${fid}/map/`)
    }
    componentDidUpdate(pP){
        if(pP.match.params.fid !== this.props.match.params.fid)
        {
            const {pid, fid} = this.props.match.params
            this.props.history.push(`/gov/барилга-суурин-газар/${pid}/${fid}/map/`)
        }
    }

    
    render() {

        const { fields } = this.props
        const pid = this.props.match.params.pid
        const fid = this.props.match.params.fid

        return (
            <div className="card">
            <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                <Switch>
                    <Route path="/gov/барилга-суурин-газар/:pid/:fid/map/" render={(routeProps) =>
                        <Map { ...routeProps } fields={ fields } addNotif={ this.addNotif } />
                    }/>
                </Switch>
           </div>
        )
    }
}
