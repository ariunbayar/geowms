import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {List} from "./layer_list"
import {GroupAdd} from "./group_add"

export class LayerGroups extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">
                    <Switch>
                        <Route exact path={"/back/layer-groups/"} component={List}/>
                        <Route exact path={"/back/layer-groups/:group_name/засах/"} component={GroupAdd}/>
                        <Route path={"/back/layer-groups/нэмэх/"} component={GroupAdd}/>
                    </Switch>
                </div>
            </div>
        )

    }

}
