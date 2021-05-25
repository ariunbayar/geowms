import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import { Detail } from "./Detail"
import { RequestAdd } from './RequestAdd'


export default class Request extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/llc/llc-request/" component={Detail} />
                <Route
                    path="/llc/llc-request/Хүсэлт-нэмэх/"
                    component={(props) =>
                        <RequestAdd {...props}/>
                    }
                />
            </Switch>
        )
    }

}
