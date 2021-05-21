import React, { Component, Suspense } from 'react'
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import MenuItem from "@utils/MenuItem"
import SuspenseLoader from "@utils/Loader/SuspenseLoader"

export class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="col-md-12 text-danger">
                <h1 className="text-danger d-block">hohohohoh</h1>
                <h1 className="text-danger d-block">hohohohoh</h1>
                <h1 className="text-danger d-block">hohohohoh</h1>
                <h1 className="text-danger d-block">hohohohoh</h1>
                <h1 className="text-danger d-block">hohohohoh</h1>
                <h1 className="text-danger d-block">hohohohoh</h1>
            </div>
        )
    }
}
