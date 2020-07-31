import React, { Component } from "react"
import {service} from '../service'
import {Switch, Route} from "react-router-dom"
import {AddUserForm} from './AddUserForm'
import {AddUser} from './AddUser'

export class Govorg_level_4 extends Component {


    constructor(props) {

        super(props)
    }

    componentDidMount() {
    }


    render() {
        return (
            <Switch>
                <Route exact path={'/back/user/level/4/'} component={AddUserForm}/>
                <Route exact path={'/back/user/level/4/нэмэх/'} component={AddUser}/>
            </Switch>
        )
    }
}
