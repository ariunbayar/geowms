import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'


export class Qgis extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/qgis/"} component={Жагсаалт}/>
                <Route exact path={"/back/qgis/detail/:schemaname/:tablename/"} component={Дэлгэрэнгүй}/>
            </Switch>
        )

    }

}
