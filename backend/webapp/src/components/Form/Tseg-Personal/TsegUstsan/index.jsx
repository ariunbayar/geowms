import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {FormTseg} from './Form'
import {List} from './List'

export class TsegUstsan extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/froms/tseg-info/tsegpersonal/tseg-ustsan/"} component={List}/>
                    <Route exact path={"/back/froms/tseg-info/tsegpersonal/tseg-ustsan/add/"} component={FormTseg}/>
                    <Route exact path={"/back/froms/tseg-info/tsegpersonal/tseg-ustsan/:id/засах"} component={FormTseg}/>
            </Switch>
        )

    }

}