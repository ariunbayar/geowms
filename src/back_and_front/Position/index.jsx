import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import PositionList from "@help_comp/Position/PositionList"
import PositionAdd from "@help_comp/Position/PositionAdd"


export default class Position extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const is_superuser = this.props.is_superuser
        const is_admin = this.props.is_admin

        var allow
        var is_backend
        if (is_superuser) {
            allow = is_superuser
            is_backend = true
        }
        else {
            allow = is_admin
            is_backend = false
        }

        return (
            <Switch>
                {allow
                    &&
                    <>
                        {/* gov */}
                        <Route exact path="/gov/perm/position/" component={ (props) => <PositionList {...props} allow={allow} is_backend={is_backend} />}/>
                        <Route exact path="/gov/perm/position/add/" component={ (props) => <PositionAdd {...props} allow={allow} is_backend={is_backend} />}/>

                        {/* back */}
                        <Route exact path="/back/байгууллага/түвшин/:level/:id/position/" component={ (props) => <PositionList {...props} allow={allow} is_backend={is_backend} />}/>
                        <Route exact path="/back/байгууллага/түвшин/:level/:id/position/add/" component={ (props) => <PositionAdd {...props} allow={allow} is_backend={is_backend} />}/>

                    </>
                }
            </Switch>
        )
    }

}
