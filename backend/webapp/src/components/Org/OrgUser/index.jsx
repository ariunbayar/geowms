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
            positions: [],
            states: [],
            pro_classes: [],
        }
        this.getSelectValue = this.getSelectValue.bind(this)
    }

    componentDidMount() {
        this.getSelectValue()
    }

    getSelectValue() {
        service
            .getSelectValue()
            .then(({ success, positions, states, pro_classes }) => {
                if (success) {
                    this.setState({ positions, states, pro_classes })
                }
            })
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
                            positions={this.state.positions}
                            states={this.state.states}
                            pro_classes={this.state.pro_classes}
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
                            positions={this.state.positions}
                            states={this.state.states}
                            pro_classes={this.state.pro_classes}
                        />
                    }
                />
            </Switch>
        )
    }
}
