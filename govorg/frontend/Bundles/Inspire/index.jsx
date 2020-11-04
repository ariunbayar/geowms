import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import Modal from "../../../../src/components/Modal/DeleteModal"
import {Notif} from '../../../../src/components/Notification/index'
import Map from "./Map"
import {service} from './service'


export default class Bundles extends Component {


    constructor(props){
        super(props)
        this.too = 0
        this.state = {
            show: false,
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
        const {tid, pid, fid} = this.props.match.params
        this.props.history.push(`/gov/org/map/${tid}/${pid}/${fid}/map/`)
    }

    componentDidUpdate(pP){
        if(pP.match.params.fid !== this.props.match.params.fid)
        {
            const {tid, pid, fid} = this.props.match.params
            this.props.history.push(`/gov/org/map/${tid}/${pid}/${fid}/map/`)
        }
    }


    render() {
        return (
            <div className="card">
            <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                <Switch>
                    <Route path="/gov/org/map/:tid/:pid/:fid/map/" render={(routeProps) =>
                        <Map { ...routeProps }  addNotif={ this.addNotif } />
                    }/>
                </Switch>
           </div>
        )
    }
}
