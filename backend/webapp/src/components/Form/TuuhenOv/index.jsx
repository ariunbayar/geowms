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
                <Route exact path={"/back/froms/tuuhen-ov/add/"} component={Form}/>
                <Route exact path={"/back/froms/tuuhen-ov/:id/add/"} component={AddForm}/>
                <Route exact path={"/back/froms/tuuhen-ov/:id/update/"} component={Form}/>
                <Route exact path={"/back/froms/tuuhen-ov/dursgalt-gazar/"} component={DursgaltGazar}/>
                <Route exact path={"/back/froms/tuuhen-ov/dursgalt-gazar/:id/update/"} component={DursgaltGazar}/>
                
                <Route exact path={"/back/froms/tuuhen-ov/"} component={FormList}/>



            </Switch>
        )
    }

}
