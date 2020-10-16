import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {BundleList} from './BundleList'
import {BundleTab} from './BunldeTab'
import {DedsanBvtets} from '../DedsanBvtets/DedsanBvtets'

export class BundlePage extends Component {


    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div>
                    <div className="text-right">
                        <NavLink className="btn gp-btn-primary waves-effect waves-light m-1" to={`/back/дэд-сан/butets/`}>
                           Дэдсан Бүтэц
                        </NavLink>
                    </div>
                    <Switch>
                        <Route path={"/back/дэд-сан/:id/засах/"} component={BundleTab}/>
                        <Route exact path={"/back/дэд-сан/butets/"} component={DedsanBvtets}/>
                        <Route exact path={"/back/дэд-сан/"} component={BundleList}/>
                        <Route exact path={"/back/дэд-сан/үүсгэх"} component={BundleTab}/>
                    </Switch>
                </div>
            )
        }
    }
