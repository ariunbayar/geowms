import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'


export class UserPage extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)
        return (
            <Switch>
                <Route exact path={"/back/user/"} component={Жагсаалт}/>
                <Route exact path={"/back/user/:id/дэлгэрэнгүй/"} component={Дэлгэрэнгүй}/>
            </Switch>
        )

    }

}
