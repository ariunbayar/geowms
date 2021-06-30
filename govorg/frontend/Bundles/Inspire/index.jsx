import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import BarilgaSuurinGazar from "./Map"

export default class Bundles extends Component {


    constructor(props){
        super(props)
        this.state = {
            org_geom: this.props.org_geom
        }
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

        if(pP.org_geom !== this.props.org_geom)
        {
            this.setState({org_geom: this.props.org_geom})
        }
    }


    render() {
        return (
            <div className="card">
            <Switch>
                <Route path="/gov/org/map/:tid/:pid/:fid/map/"
                    render={(routeProps) =>
                        <BarilgaSuurinGazar
                            {...routeProps}
                            employee={this.props.employee}
                            base_layer_list={this.props.base_layer_list}
                            allowed_geom = {this.state.org_geom}
                        />
                    }
                />
            </Switch>
           </div>
        )
    }
}
