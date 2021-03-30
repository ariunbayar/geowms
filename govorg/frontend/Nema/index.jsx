import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { NemaTable } from './nema_layer_list'
import { ModelAddNema } from './add_model'
import NemaMap from "./Map"

export default class Nema extends Component {

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body p-0 m-2">
                            <Switch>
                                <Route exact path="/gov/nema/list/" component={NemaTable} />
                                <Route exact path="/gov/nema/map/" component={(props) => <NemaMap {...props} employee={this.props.employee}/>}/>
                                <Route exact path="/gov/nema/үүсгэх/" component={ModelAddNema} />
                                <Route exact path="/gov/nema/:id/засах/" component={ModelAddNema} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
