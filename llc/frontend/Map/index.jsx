import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {LLCMap} from './LLC_Map'


export default class Map extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/llc/map/" component={LLCMap} />
            </Switch>
        )
    }

}
