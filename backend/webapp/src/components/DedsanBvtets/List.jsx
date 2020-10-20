import React, { Component } from 'react'
import { service } from './service'
import {Switch, Route, NavLink} from "react-router-dom"
import { CompilationStatus } from 'webpack-build-notifier/dist/types'
import SideBar from './sideTable'
import './style.css'

export class List extends Component {

    constructor(props) {
        super(props)

        this.features = []
        this.state={
            list_all:[],
            feature_names: [],
            data_type_names: [],
            property_names: [],
            code_list_values: [],
            value_type_names: [],
            feature_configs_name: [],
            fields: [],
            show_side: false,
        }
        this.getAll = this.getAll.bind(this)
        this.getFields = this.getFields.bind(this)
        this.showSideBar = this.showSideBar.bind(this)
        this.closeSide = this.closeSide.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        service.getall().then(({success, data }) => {
            if(success){
                this.setState({
                    list_all: data,
                })
                console.log('data', data)
            }
        })
    }

    getFields(id, name) {
        const data = this.state.list_all
        const found = data.filter(element => {
            return element.id == id
        })
        this.setState({ found })
        console.log(found)
        service.getFields(id, name).then(({success, fields}) => {
            if(success){
                this.setState({
                    fields,
                })
            }
        })
    }

    getProperties(code) {
        this.features = []
        // const data = this.state.list_all
        // data.map(element => {
        //     element.package.map(pack => {
        //         pack.features.map(features => {
        //             if(features.id = id){
        //                 this.feature = features
        //             }
        //         })
        //     })
        // })
        // console.log(this.feature)
        service.getprop(code).then(rsp => {
            if(rsp.success){
                this.setState({
                    feature_names: rsp.feature_names,
                    feature_configs_name: rsp.feature_configs_name,
                    data_type_names: rsp.data_type_names,
                    property_names: rsp.property_names,
                    value_type_names: rsp.value_type_names,
                    code_list_values: rsp.code_list_values,
                })
                this.features.push({
                    'feature_names': rsp.feature_names,
                    'feature_configs_name': rsp.feature_configs_name,
                    'data_type_names': rsp.data_type_names,
                    'property_names': rsp.property_names,
                    'value_type_names': rsp.value_type_names,
                    'code_list_values': rsp.code_list_values,
                })
                this.showSideBar()
            }
            console.log(rsp)
        })
    }

    showSideBar(){
        this.setState({ show_side: true })
    }

    closeSide(){
        this.setState({ show_side: false })
        this.features = []
    }

    render() {
        const { list_all, show_side } = this.state
        return (
                <div className="card col-md-12 border border-danger">
                    <div className="card-body">
                        <ul>
                        {list_all.map((theme, idx) =>
                            <li key={idx}>
                                <a onClick={() => this.getFields(theme.id, 'theme')}>
                                    <span className="hidden-xs gp-text-primary">{theme.id} : {theme.name} : {theme.code}</span>
                                </a>
                                <ul>
                                    {theme.package.map((packages, idx) =>
                                        <li key={idx}>
                                            <a onClick={() => this.getFields(packages.id, 'package')}>
                                                <span className="hidden-xs gp-text-primary">{packages.id} : {packages.name} : {packages.code}</span>
                                            </a>
                                            <ul>
                                                {packages.features.map((feature, idx) =>
                                                    <li key={idx}>
                                                        <a onClick={() => this.getProperties(feature.code)}>
                                                            <i className="fa fa-table"></i>
                                                            <span className="hidden-xs gp-text-warning" >{feature.name} : {feature.code}</span>
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        )}
                        </ul>
                    </div>
                <SideBar show_side={show_side} handleClose={() => this.closeSide()} features={this.features}/>
                </div>
        )
    }

}

