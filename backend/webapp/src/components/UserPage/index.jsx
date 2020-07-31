import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Menu} from './Menu'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'

import {Govorg_level_1} from './Govorg_level_1/index'
import {Govorg_level_2} from './Govorg_level_2/index'
import {Govorg_level_3} from './Govorg_level_3/index'
import {Govorg_level_4} from './Govorg_level_4/index'



export class UserPage extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/user/"} component={Menu}/>
                <Route exact path={"/back/user/:id/дэлгэрэнгүй/"} component={Дэлгэрэнгүй}/>
                <Route exact path={"/back/user/govorg/level/1/"} component={Govorg_level_1}/>
                <Route exact path={"/back/user/govorg/level/2/"} component={Govorg_level_2}/>
                <Route exact path={"/back/user/govorg/level/3/"} component={Govorg_level_3}/>
                <Route path={"/back/user/govorg/level/4/"} component={Govorg_level_4}/>
            </Switch>
        )

    }

}
