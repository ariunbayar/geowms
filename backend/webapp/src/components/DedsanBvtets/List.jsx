import React, { Component } from 'react'
import { service } from './service'
import {Switch, Route, NavLink} from "react-router-dom"
import { CompilationStatus } from 'webpack-build-notifier/dist/types'
import SideBar from './sideTable'
import './style.css'

export class List extends Component {

    constructor(props) {
        super(props)

        this.state = {
            list_all:[],
            feature_lists: [],
            check: ''
        }
        this.getAll = this.getAll.bind(this)
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
            }
        })
    }

    getProperties(code) {
        service.getprop(code).then(rsp => {
            if(rsp.success){
                this.setState({
                    feature_lists: rsp.feature_lists,
                    check: rsp.check
                })
            }
        })
    }

    render() {
        const { list_all } = this.state
        return (
            <div className="row m-0">
                <div className="card col-md-5">
                    <div className="card-body">
                        <ul>
                        {list_all.map((theme, idx) =>
                            <li key={idx}>
                                    <span> {theme.name} </span>
                                <ul>
                                    {theme.package.map((packages, idx) =>
                                        <li key={idx}>
                                                <span> {packages.name} </span>
                                            <ul>
                                                {packages.features.map((feature, idx) =>
                                                    <li key={idx}>
                                                        <a onClick={() => this.getProperties(feature.code)}>
                                                            <i className="fa fa-table"></i> &nbsp;
                                                            <span role="button" className="hidden-xs gp-text-primary" > {feature.name} </span>
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
                </div>
                <SideBar features={this.state.feature_lists} check={this.state.check}/>
            </div>
        )
    }

}