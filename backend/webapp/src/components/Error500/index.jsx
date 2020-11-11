import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Жагсаалт } from './Жагсаалт'


export class Error500 extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/error500/"} component={Жагсаалт}/>
            </Switch>
        )
    }
}
