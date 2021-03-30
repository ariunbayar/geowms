import React, { Component } from "react"
import { service} from '../service'
import { Switch , Route, Link, NavLink } from "react-router-dom"
import { UserTable } from './UserTable'
import { UserAdd } from './UserAdd'
import { Detail } from './Detail'


export class OrgUser extends Component {

    constructor(props) {

        super(props)

        this.state = {
        }
    }

    render() {
        return (
            <Switch>
                <Route exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/" component={ UserTable }/>
                <Route
                    exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/нэмэх/"
                    component={(props) =>
                        <UserAdd
                            {...props}
                            refreshCount={this.props.refreshCount}
                        />
                    }
                />
                <Route exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/:emp/дэлгэрэнгүй/" component={ Detail }/>
                <Route
                    exact path="/back/байгууллага/түвшин/:level/:id/хэрэглэгч/:emp/засах/"
                    component={(props) =>
                        <UserAdd
                            {...props}
                            refreshCount={this.props.refreshCount}
                        />
                    }
                />
            </Switch>
        )
    }
}
