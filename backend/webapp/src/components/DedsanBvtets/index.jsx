import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {List} from './List'

export default class DedsanBvtets extends Component {


    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div>
                    <Switch>
                        <Route path={"/back/дэд-сан-бүтэц/"} component={List}/>
                    </Switch>
                </div>
            )
        }
    }
