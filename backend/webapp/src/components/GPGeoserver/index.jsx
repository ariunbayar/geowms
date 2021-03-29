import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import GPStyle from './GeoStyle/index'
import GPGroup from './Layergroups/index'


export default class GPGeoserver extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div>
                    <Switch>
                        <Route path={"/back/gp-geoserver/layer-groups/"} component={GPGroup}/>
                        <Route exact path={"/back/gp-geoserver/style/"} component={GPStyle}/>
                    </Switch>
                </div>
            )
        }
    }
