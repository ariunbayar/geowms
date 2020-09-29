import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {CrudEvenLog} from './CrudEvenLog/CrudEvenLog'
import {LoginLog} from './LoginLog/LoginLog'
import {PageLog} from './PageLog/PageLog'


export class Access extends Component {

    constructor(props) {
        super(props)

        this.default_url = '/back/access/login/'

    }

    componentDidMount() {
        if (this.props.location.pathname.endsWith('access/')) {
            this.props.history.push(this.default_url)
        }
    }

    componentDidUpdate() {
        if (this.props.location.pathname.endsWith('access/')) {
            this.props.history.push(this.default_url)
        }
    }

    render() {

        return (
            <Switch>
                <Route path={"/back/access/login/"} component={LoginLog} />
                <Route path={"/back/access/logout/"} component={CrudEvenLog} />
                <Route path={"/back/access/page/"} component={PageLog} />
            </Switch>
        )

    }

}
