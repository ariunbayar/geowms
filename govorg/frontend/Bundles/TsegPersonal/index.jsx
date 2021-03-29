import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import TsegTemdegt from './TsegTemdegt'
import TsegUstsan from './TsegUstsan'

import TsegAddEdit from './TsegTemdegt/TsegAddEdit'
import UstsanAddEdit from './TsegUstsan/UstsanAddEdit'

export default class Tseg extends Component {


    constructor(props){
        super(props)
        this.state = {
        }
    }


    render() {
        return (
            <div className="card">
                <Switch>
                    <Route path="/gov/tseg-personal/list/" component={TsegTemdegt}/>
                    <Route path="/gov/tseg-personal/tseg-ustsan/list/" component={TsegUstsan}/>

                    <Route path="/gov/tseg-personal/add/" component={TsegAddEdit}/>
                    <Route path="/gov/tseg-personal/:id/edit/" component={TsegAddEdit}/>

                    <Route path="/gov/tseg-personal/tseg-ustsan/add/" component={UstsanAddEdit}/>
                    <Route path="/gov/tseg-personal/tseg-ustsan/:id/edit/" component={UstsanAddEdit}/>

                </Switch>
           </div>
        )
    }
}
