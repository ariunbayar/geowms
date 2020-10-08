import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {BundleList} from './BundleList'
import {BundleTab} from './BunldeTab'

export class BundlePage extends Component {


    constructor(props) {
        super(props)
    }

    render() {

            return (
                <Switch>
                    <Route path={"/back/дэд-сан/:id/засах/"} component={BundleTab}/>
                    <Route exact path={"/back/дэд-сан/"} component={BundleList}/>
                    <Route exact path={"/back/дэд-сан/үүсгэх"} component={BundleTab}/>
                </Switch>
            )

        }

    }
