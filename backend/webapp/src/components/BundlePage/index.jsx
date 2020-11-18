import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {BundleList} from './BundleList'
import {BundleForms} from './BundleForms'

export class BundlePage extends Component {


    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route path={"/back/дэд-сан/:id/засах/"} component={BundleForms}/>
                <Route path={"/back/дэд-сан/үүсгэх/"} component={BundleForms}/>
                <Route exact path={"/back/дэд-сан/"} component={BundleList}/>
            </Switch>
        )
    }
}
