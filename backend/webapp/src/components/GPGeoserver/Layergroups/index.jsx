import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {List} from "./layer_list"
import { GroupAdd } from "./group_add"
import { TileCaching } from "./tile_caching"

export default class GPGroup extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <Switch>
                        <Route exact path={"/back/gp-geoserver/layer-groups/"} component={List}/>
                        <Route path={"/back/gp-geoserver/layer-groups/:group_name/tile-caching/"} component={TileCaching}/>
                        <Route path={"/back/gp-geoserver/layer-groups/нэмэх/"} component={GroupAdd}/>
                        <Route path={"/back/gp-geoserver/layer-groups/:group_name/засах/"} component={GroupAdd}/>
                    </Switch>
                </div>
            </div>
        )
        }
    }
