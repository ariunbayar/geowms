import React, { Component } from "react"
import { service } from "./service"


export class QgisSystem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        service.getToken().then(({success, token}) => {
            if(success) this.setState({token})
        })
        console.log(window.location.origin)
    }
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h3>Qgis {'>'} WFS {'>'} new connection</h3>
                    <h5><a className="text-primary">{window.location.origin}/api/service/{this.state.token}/</a></h5>
                </div>
            </div>
        )
    }

}
