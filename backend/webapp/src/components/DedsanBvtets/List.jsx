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
            check: '',
            form_is_laod: true,
            form_is_laod_left: true
        }
        this.getAll = this.getAll.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.handleFormLeft = this.handleFormLeft.bind(this)
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
        this.setState({form_is_laod:true})
        service.getprop(code).then(rsp => {
            if(rsp.success){
                this.setState({
                    feature_lists: rsp.feature_lists,
                    check: rsp.check
                })
            }
        })
    }

    handleForm(id){
        console.log(id)
        this.setState({form_is_laod:false})
    }

    handleFormLeft(id){
        console.log(id)

        this.setState({form_is_laod_left:false})
    }

    render() {
        const { list_all, form_is_laod_left } = this.state
        return (
            <div className="row m-0">
                <div className="card col-md-5">
                    <div className="card-body">
                        {form_is_laod_left ?
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
                                                    <li><a type="button" className="gp-text-primary" onClick={() => this.handleForm(packages.package_id)}><i className="fa fa-plus-circle gp-text-primary"></i> Давхрага нэмэх</a></li>
                                                </ul>
                                            </li>
                                        )}
                                        <li><a type="button" className="gp-text-primary" onClick={() => this.handleForm(theme.theme_id)}><i className="fa fa-plus-circle gp-text-primary"></i> Багц нэмэх</a></li>
                                    </ul>
                                </li>
                            )}
                            <li><a type="button" className="gp-text-primary" onClick={() => this.handleForm("theme")}><i className="fa fa-plus-circle gp-text-primary"></i> Дэд сан нэмэх</a></li>
                            </ul>
                            :
                            <a onClick={() => this.setState({form_is_laod_left:true})}>bolsoon</a>
                        }


                    </div>
                </div>
                <div className={`card col-md-7`} style={{left:"10px"}}>
                    <div className="card-body">
                        {this.state.form_is_laod ?
                        <SideBar features={this.state.feature_lists} check={this.state.check}/>:
                        <a onClick={() => this.handleFormLeft(1)}>asdasdasdas</a>
                        }
                    </div>
                </div>
            </div>
        )
    }

}