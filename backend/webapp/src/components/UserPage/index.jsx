import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Menu} from './Menu'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'


export class UserPage extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/user/"} component={Menu}/>
                <Route exact path={"/back/user/:id/дэлгэрэнгүй/"} component={Дэлгэрэнгүй}/>
            </Switch>
        )

    }

}
