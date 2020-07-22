import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'
import {GovorgForm} from './GovorgForm'


export class GovorgPage extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        
        console.log(this.props)
        return (
            <Switch>
                <Route exact path={"/back/байгууллага/"} component={Жагсаалт}/>
                <Route exact path={"/back/байгууллага/:id/дэлгэрэнгүй/"} component={Дэлгэрэнгүй}/>
                <Route exact path={"/back/байгууллага/үүсгэх/"} component={GovorgForm}/>
                <Route exact path={"/back/байгууллага/:id/засах/"} component={GovorgForm}/>
            </Switch>
        )

    }

}
