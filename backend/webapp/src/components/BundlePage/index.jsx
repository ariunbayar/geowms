import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {BundleForms} from './BundleForms'
import {BundleList} from './BundleList'

export class BundlePage extends Component {


    constructor(props) {
        super(props)
    }

    render() {

            return (
                <Switch>
                    <Route exact path={"/back/дэд-сан/"} component={BundleList}/>
                    <Route exact path={"/back/дэд-сан/:id/засах/"} component={BundleForms}/>
                    <Route exact path={"/back/дэд-сан/үүсгэх"} component={BundleForms}/>
                </Switch>
            )

        }

    }
