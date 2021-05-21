import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {Detail} from './Detail'


export default class LLCRequest extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/llc-request/" component={Detail} />
            </Switch>
        )
    }

}
