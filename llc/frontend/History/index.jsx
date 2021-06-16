import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import { List } from './List'
import { Detail } from './Detail'

export default class History extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/llc/history/" component={List} />
                <Route path="/llc/history/:id/дэлгэрэнгүй/" component={Detail}/>
            </Switch>
        )
    }

}
