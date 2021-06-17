import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import PositionList from "@help_comp/Position/PositionList"
import PositionAdd from "@help_comp/Position/PositionAdd"


export default class Position extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const employee = this.props.employee

        return (
            <Switch>
                {employee.is_admin
                    &&
                    <>
                        <Route exact path="/gov/perm/position/" component={ (props) => <PositionList {...props} employee={employee} />}/>
                        <Route exact path="/gov/perm/position/add/" component={ (props) => <PositionAdd {...props} employee={employee} />}/>

                    </>
                }
            </Switch>
        )
    }

}
