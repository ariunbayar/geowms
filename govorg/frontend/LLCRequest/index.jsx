import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {Detail} from './Detail'
import {LLCSettings} from './sett_comp'

export default class LLCRequest extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/llc-request/" component={Detail}/>
                <Route path="/gov/llc-request/:id/configure-bundle/" component={LLCSettings}/>
            </Switch>
        )
    }

}
