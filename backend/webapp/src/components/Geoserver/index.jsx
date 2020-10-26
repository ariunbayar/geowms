import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Layers} from './Layers'


export class Geoserver extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route path={"/back/geoserver/layers/"} component={Layers}/>
            </Switch>
        )

    }

}
