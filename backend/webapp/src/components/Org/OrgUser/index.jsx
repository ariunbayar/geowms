import React, { Component } from "react"
import {service} from '../service'
import {Switch , Route, Link, NavLink} from "react-router-dom"
import {UserForm } from './UserForm'
import {UserAdd } from './UserAdd'
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
                <Route exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/" component={UserForm}/>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/нэмэх/" component={UserAdd}/>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/Дэлгэрэнгүй/" component={Дэлгэрэнгүй}/>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/:emp/засах/" component={UserAdd}/>
            </Switch>
        )
    }
}
