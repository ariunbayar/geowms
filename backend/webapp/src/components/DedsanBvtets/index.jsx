import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import { List } from './List'

export default class DedsanBvtets extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }

    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={"/back/дэд-сан-бүтэц/"} component={(props) => <List {...props}/>} />
                </Switch>
            </div>
        )}
    }
