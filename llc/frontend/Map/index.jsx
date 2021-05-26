import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {LLCMap} from '../LLCMap'
import {service} from './service'


export default class Map extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vector_datas: []
        }
        this.getAllGeoJson = this.getAllGeoJson.bind(this)
    }
    componentDidMount() {
        this.getAllGeoJson()
    }

    getAllGeoJson() {
        service.getAllGeoJson().then(({geo_json_datas}) =>{
            this.setState({vector_datas: geo_json_datas})
        })
    }

    render() {
        return (
            <Switch>
                <Route
                    exact path="/llc/map/"
                    component={(props) => <LLCMap {...props} vector_datas={this.state.vector_datas} height={'100vh'}/>}
                />
            </Switch>
        )
    }

}
