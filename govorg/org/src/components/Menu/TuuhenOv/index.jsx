import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'
import {FormList} from './FormList'
import {AddForm} from './AddForm'
import {DursgaltGazar} from './DursgaltGazar'

export class TuuhenOv extends Component {

    constructor(props) {
        super(props)

        this.state={
            perms: props.perms,
        }
    }

    componentDidMount(){
        const { perms } = this.state
    }
    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.state.perms
        return (
            <Switch>
                {perm_view && perm_create ? <Route exact path={"/gov/tuuhen-ov/add/"} component={Forms}/> : null}
                {perm_view ? <Route exact path={"/gov/tuuhen-ov/:id/add/"} component={(id) => <AddForm id={id} perms={this.state.perms} />}/> : null}
                {perm_view && perm_create && perm_remove ? <Route exact path={"/gov/tuuhen-ov/:id/update/"} component={Forms}/> : null}
                {perm_view && perm_create ? <Route exact path={"/gov/tuuhen-ov/dursgalt-gazar/:id/"} component={DursgaltGazar}/> : null}
                {perm_view && perm_create && perm_remove ? <Route exact path={"/gov/tuuhen-ov/dursgalt-gazar/:id/update/:idx/"} component={DursgaltGazar}/> : null}
                {perm_view ? <Route exact path={"/gov/tuuhen-ov/"} component={()=><FormList perms={this.state.perms}/>}/> : null}
            </Switch>
        )
    }

}
