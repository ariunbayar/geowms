import React, { Component } from "react"
import {service} from '../service'
import {Switch , Route, Link, NavLink} from "react-router-dom"
import {UserForm } from './UserForm'
import {Useradd } from './Useradd'
import {Дэлгэрэнгүй} from './Дэлгэрэнгүй'



export class OrgUser extends Component {


    constructor(props) {

        super(props)

        this.state = {
        }

    }

    componentDidMount() {
    }


    render() {
        return (
            <Switch>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/байгуулга/" component={UserForm}/>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/нэмэх/" component={Useradd}/>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/Дэлгэрэнгүй/" component={Дэлгэрэнгүй}/>
            </Switch>
        )
    }
}
