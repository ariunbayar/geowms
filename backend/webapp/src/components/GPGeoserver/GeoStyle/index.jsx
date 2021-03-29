import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {CreateStyle} from './style_add'

export default class GPStyle extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div>
                    <Switch>
                        <Route path={"/back/gp-geoserver/style/"} component={CreateStyle}/>
                    </Switch>
                </div>
            )
        }
    }
