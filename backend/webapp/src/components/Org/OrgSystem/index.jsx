import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'
import {GovorgForm} from './GovorgForm'


export class OrgSystem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        
        return (
            <Switch>
                <Route exact path={"/back/байгууллага/түвшин/:level/:id/систем/"} component={Жагсаалт}/>
                <Route exact path={"/back/байгууллага/түвшин/:level/:id/систем/:system_id/дэлгэрэнгүй/"} component={Дэлгэрэнгүй}/>
                <Route exact path={"/back/байгууллага/түвшин/:level/:id/систем/үүсгэх/"} component={GovorgForm}/>
                <Route exact path={"/back/байгууллага/түвшин/:level/:id/систем/:system_id/засах/"} component={GovorgForm}/>
            </Switch>
        )

    }

}
