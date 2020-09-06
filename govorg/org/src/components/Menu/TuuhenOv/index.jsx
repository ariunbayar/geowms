import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'
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
                <Route exact path={"/gov/tuuhen-ov/add/"} component={Forms}/>
                <Route exact path={"/gov/tuuhen-ov/:id/add/"} component={AddForm}/>
                <Route exact path={"/gov/tuuhen-ov/:id/update/"} component={Forms}/>
                <Route exact path={"/gov/tuuhen-ov/dursgalt-gazar/:id/"} component={DursgaltGazar}/>
                <Route exact path={"/gov/tuuhen-ov/dursgalt-gazar/:id/update/:idx/"} component={DursgaltGazar}/>
               
                <Route exact path={"/gov/tuuhen-ov/"} component={FormList}/>



            </Switch>
        )
    }

}
