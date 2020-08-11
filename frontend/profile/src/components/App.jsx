
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";

import {Profile} from './history/Profile'


export class App extends Component {

    render() {
        return (
          <Profile/>
        )
    }
}