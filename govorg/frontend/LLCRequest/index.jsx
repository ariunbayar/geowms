import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {Detail} from './Detail'
import {LLCSettings} from './sett_comp'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'

export default class LLCRequest extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/llc-request/" component={Detail}/>
                <Route exact path="/gov/llc-request/:id/Дэлгэрэнгүй/" component={Дэлгэрэнгүй}/>
                <Route path="/gov/llc-request/:id/configure-bundle/" component={LLCSettings}/>
            </Switch>
        )
    }

}
