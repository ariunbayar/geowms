import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Жагсаалт} from './Жагсаалт'
import {Үүсгэх} from './Үүсгэх'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'

import './style.css'


export default class СуурьДавхаргаХуудас extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Switch>
                <Route exact path={"/back/суурь-давхарга/"} component={Жагсаалт}/>
                <Route path={"/back/суурь-давхарга/:id/дэлгэрэнгүй/"} component={Дэлгэрэнгүй}/>
                <Route exact path={"/back/суурь-давхарга/үүсгэх/"} component={Үүсгэх}/>
            </Switch>
        )

    }

}
