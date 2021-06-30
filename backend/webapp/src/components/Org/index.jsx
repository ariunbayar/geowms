import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import {OrgForm} from './OrgForm'
import {OrgAdd} from './OrgAdd'
import {OrgMenu} from './OrgMenu'
export default class Org extends Component {

    constructor(props) {
        super(props)

        this.default_url = '/back/байгууллага/түвшин/1/'

        this.state = {
            user_count: 0,
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body row">
                    <div className="col-md-12">
                        <Switch>
                            <Route exact path="/back/байгууллага/түвшин/:level/" component={OrgForm}/>
                            <Route exact path="/back/байгууллага/түвшин/:level/нэмэх/" component={OrgAdd}/>
                            <Route exact path="/back/байгууллага/түвшин/:level/:id/засах/" component={OrgAdd}/>
                            <Route path="/back/байгууллага/түвшин/:level/:id/" component={OrgMenu}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
