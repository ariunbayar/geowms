import React, { Component, Fragment } from 'react'
import {Switch, Route,  NavLink} from 'react-router-dom'

import CovidConfig from './CovidConfig'


export class Covid extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-6">
                        <CovidConfig/>
                    </div>
                </div>
            </div>
        )
    }

}
