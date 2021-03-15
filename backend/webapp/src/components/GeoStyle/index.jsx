import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {CreateStyle} from './style_add'

export default class GeoserverStyle extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div>
                    <Switch>
                        <Route path={"/back/geoserver-style/"} component={CreateStyle}/>
                    </Switch>
                </div>
            )
        }
    }
