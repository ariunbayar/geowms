import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Form} from './Form'
import {FormList} from './FormList'
import {AddForm} from './AddForm'
import {DursgaltGazar} from './DursgaltGazar'

export class TuuhenOv extends Component {

    constructor(props) {
        super(props)
        
    }

    render() {
        
        return (
            <Switch>
                <Route exact path={"/back/froms/dursgalt-gazar/add/"} component={DursgaltGazar}/>
                <Route exact path={"/back/froms/dursgalt-gazar/:id/update/"} component={DursgaltGazar}/>
                <Route exact path={"/back/froms/"} component={FormList}/>
                <Route exact path={"/back/froms/add/"} component={Form}/>
                <Route exact path={"/back/froms/:id/add/"} component={AddForm}/>
                <Route exact path={"/back/froms/:id/update/"} component={Form}/>


            </Switch>
        )
    }

}
