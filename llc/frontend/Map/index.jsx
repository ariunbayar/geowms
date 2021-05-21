import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {Detail} from './Detail'


export default class Map extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/llc/map/" component={Detail} />
            </Switch>
        )
    }

}
