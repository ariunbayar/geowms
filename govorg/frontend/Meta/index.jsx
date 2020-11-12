import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { MetaDetail } from './MetaDetail'
import { MetaEdit } from "./MetaEdit"
import { MetaForm } from "./MetaForm"

export class Meta extends Component {

    // constructor(props) {
    //     super(props)
    // }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/meta/" component={MetaForm} />
                <Route exact path="/gov/meta/edit/" component={MetaEdit} />
                <Route exact path="/gov/meta/detail/" component={MetaDetail} />
            </Switch>
        )
    }

}
