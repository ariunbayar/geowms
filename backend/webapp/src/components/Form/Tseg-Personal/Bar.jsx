import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {TsegPersonal} from './TsegPersonal/index'
import {TsegUstsan} from '../Tseg-Personal/TsegUstsan/index'

export class Bar extends Component {

    constructor(props) {
        super(props)
        
    }

    render() {    
        return (             
            <div>
                    <div className="container">
                    <div className="row">
                        <div className="col-md-12 py-0 my-0 ">
                            <ul className="list-group list-group-horizontal col-md-8 my-0 ml-5 pl-5  list-unstyled">
                                <li >
                                <NavLink to="/back/froms/tseg-info/tsegpersonal/tseg-personal/" className="list-group-item col-md-12 mr-2" activeClassName="text-white gp-bg-primary">
                                        Цэг тэмдэгтийн мэдээллийг засах болон нэмэх үйлдлүүдийг хийн 
                                </NavLink>
                                </li>
                                <li>
                                <NavLink to="/back/froms/tseg-info/tsegpersonal/tseg-ustsan/" className="list-group-item col-md-12 ml-2 " activeClassName="text-white gp-bg-primary">
                                            Устсан цэгийн  мэдээллийг засах болон нэмэх үйлдлүүдийг хийн 
                                </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                <Switch>
                            <Route path="/back/froms/tseg-info/tsegpersonal/tseg-personal/" component={TsegPersonal}/>
                            <Route path="/back/froms/tseg-info/tsegpersonal/tseg-ustsan/" component={TsegUstsan}/>
                            <Route exact path="/back/froms/"/>
                 </Switch>
                </div>
            </div>
        )
    }
}