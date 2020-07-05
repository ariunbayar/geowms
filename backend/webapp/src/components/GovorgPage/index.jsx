import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Govorg} from './Govorg'


export class GovorgPage extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Switch>
                <Route exact path={"/back/байгууллага/"} component={Жагсаалт}/>
                <Route exact path={"/back/байгууллага/:id/дэлгэрэнгүй/"} component={Govorg}/>
            </Switch>
        )

    }

}
