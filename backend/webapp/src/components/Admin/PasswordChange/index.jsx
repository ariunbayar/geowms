import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { PasswordChange } from './PasswordChange'


export class Admin extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/admin/password/change/"} component={PasswordChange}/>
            </Switch>
        )
    }
}
