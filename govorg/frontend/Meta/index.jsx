import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { MetaDetail } from './MetaDetail'
import { MetaEdit } from "./MetaEdit"
import { List } from "./List"

export default class Meta extends Component {

    render() {
        return (
            <Switch>
                <Route exact path="/gov/meta/" component={List} />
                <Route exact path="/gov/meta/:id/edit/" component={MetaEdit} />
                <Route exact path="/gov/meta/:id/detail/" component={MetaDetail} />
            </Switch>
        )
    }
}
