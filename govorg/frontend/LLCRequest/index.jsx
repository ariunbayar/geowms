import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {LLCList} from './LLCList'
import {Detail} from './Detail'
import {LLCSettings} from './sett_comp'

export default class LLCRequest extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/llc-request/" component={LLCList}/>
                <Route exact path="/gov/llc-request/:id/Дэлгэрэнгүй/" component={Detail}/>
                <Route path="/gov/llc-request/:id/configure-bundle/" component={LLCSettings}/>
            </Switch>
        )
    }

}
