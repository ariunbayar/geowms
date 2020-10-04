import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'


export class Gis extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/gis/"} component={Жагсаалт}/>
                <Route exact path={"/back/gis/detail/:schemaname/:tablename/"} component={Дэлгэрэнгүй}/>
            </Switch>
        )

    }

}
