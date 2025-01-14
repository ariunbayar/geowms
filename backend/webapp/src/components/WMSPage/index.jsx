import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {WmsList} from './WmsList'
import {WMSForm} from './WMSForm'
import GeoData from './GeoData'


export default class WMSPage extends Component {

    constructor(props) {
        super(props)

    }

    render() {

        return (
            <Switch>
                <Route exact path={"/back/wms/"} component={WmsList}/>
                <Route exact path={"/back/wms/:id/засах/"} component={WMSForm}/>
                <Route exact path={"/back/wms/үүсгэх"} component={WMSForm}/>
                <Route exact path={'back/wms/:id/засах/geo/'} component={GeoData}/>
            </Switch>
        )

    }

}
