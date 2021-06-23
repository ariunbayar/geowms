import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import hah from "@helpUtils/functions"
import PositionList from "@helpComp/Position/PositionList"
import PositionAdd from "@helpComp/Position/PositionAdd"

export default class Position extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_backend: false,
            is_allow: false,
        }
    }

    componentDidMount() {
        console.log(hah.test());
        const { is_superuser, is_admin } = this.props
        var { is_backend, is_allow } = this.state

        if (is_superuser) {
            is_allow = is_superuser
            is_backend = true
            this.setState({ is_backend: true, is_allow: is_superuser })
        }
        else {
            this.setState({ is_backend: false, is_allow: is_admin })
        }
    }

    render() {
        const { is_allow, is_backend } = this.state
        return (
            <Switch>
                {is_allow
                    &&
                    <>
                        {/* gov */}
                        <Route exact path="/gov/perm/position/" component={ (props) => <PositionList {...props} is_backend={is_backend}/>}/>
                        <Route exact path="/gov/perm/position/create/" component={ (props) => <PositionAdd {...props} is_backend={is_backend} />}/>
                        <Route exact path="/gov/perm/position/:pos_id/edit/" component={ (props) => <PositionAdd {...props} is_backend={is_backend} />}/>

                        {/* back */}
                        <Route exact path="/back/байгууллага/түвшин/:level/:id/position/" component={ (props) => <PositionList {...props} is_backend={is_backend}/>}/>
                        <Route exact path="/back/байгууллага/түвшин/:level/:id/position/create/" component={ (props) => <PositionAdd {...props} is_backend={is_backend} />}/>
                        <Route exact path="/back/байгууллага/түвшин/:level/:id/position/:pos_id/edit/" component={ (props) => <PositionAdd {...props} is_backend={is_backend} />}/>

                    </>
                }
            </Switch>
        )
    }

}
