import React, { Component } from 'react'
import { service } from './service'
import { Fields } from './fields'
import {Switch, Route, NavLink} from "react-router-dom"


export class List extends Component {

    constructor(props) {
        super(props)

        this.state={
            list_all:[],
        }
        this.getAll = this.getAll.bind(this)
        this.getFields = this.getFields.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        service.getall().then(({success, data, fields}) => {
            if(success){
                this.setState({
                    list_all: data,
                    fields
                })
            console.log("haha", fields)

            }
        })
    }

    getFields(id) {
        const data = this.state.list_all
        const found = data.filter(element => {
            return element.id == id
        })
        this.setState({ found })
        console.log(found)
        service.getFields(id).then(rsp => {

        })
    }

    render() {
        const { list_all, found, fields } = this.state
        return (
            <div className="row">
                <div className="card col-md-6 border border-danger">
                    <div className="card-body">
                        <ul>
                        {list_all.map((theme, idx) =>
                            <li key={idx}>
                                 <a className="nav-link" onClick={() => this.getFields(theme.id)}>
                                    <span className="hidden-xs gp-text-primary">{theme.name}</span>
                                </a>
                                <ul>
                                    {theme.package.map((packages, idx) =>
                                        <li key={idx}>
                                            {theme.id} : {packages.name}
                                            <ul>
                                                {packages.features.map((feature, idx) =>
                                                    <li key={idx}>
                                                        <i className="fa fa-table"></i>{feature.id} : {feature.name}
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
                <Fields fields={fields}/>
            </div>
        )
    }

}

