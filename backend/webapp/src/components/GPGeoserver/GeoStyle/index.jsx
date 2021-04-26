import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {CreateStyle} from './style_add'
import {StyleList} from './style_list'


export default class GPStyle extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div className="card">
                    <div className="card-body">
                        <Switch>
                            <Route exact path={"/back/gp-geoserver/style/"} component={StyleList}/>
                            <Route path={"/back/gp-geoserver/style/add/"} component={CreateStyle}/>
                            <Route path={"/back/gp-geoserver/style/:style_name/edit/"} component={CreateStyle}/>
                        </Switch>
                    </div>
                </div>
            )
        }
    }
