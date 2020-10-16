import React, { Component } from 'react'
import { service } from './service'
import { Fields } from './fields'
import {Switch, Route, NavLink} from "react-router-dom"


export class List extends Component {

    constructor(props) {
        super(props)

        this.state={
            list_all:[],
            fields: [],
            values: [],
        }
        this.getAll = this.getAll.bind(this)
        this.getFields = this.getFields.bind(this)
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

    getFields(id, name) {
        const data = this.state.list_all
        const found = data.filter(element => {
            return element.id == id
        })
        this.setState({ found })
        console.log(found)
        service.getFields(id, name).then(({success, fields, values}) => {
            if(success){
                this.setState({
                    fields,
                    values
                })
            }
        })
    }

    render() {
        const { list_all, found, fields, values } = this.state
        console.log(values)
        return (
            <div className="row">
                <div className="card col-md-6 border border-danger">
                    <div className="card-body">
                        <ul>
                        {list_all.map((theme, idx) =>
                            <li key={idx}>
                                <a onClick={() => this.getFields(theme.id, 'theme')}>
                                    <span className="hidden-xs gp-text-primary">{theme.id} : {theme.name}</span>
                                </a>
                                <ul>
                                    {theme.package.map((packages, idx) =>
                                        <li key={idx}>
                                            <a onClick={() => this.getFields(packages.id, 'package')}>
                                                <span className="hidden-xs gp-text-primary">{packages.id} : {packages.name}</span>
                                            </a>
                                            <ul>
                                                {packages.features.map((feature, idx) =>
                                                    <li key={idx}>
                                                        <a onClick={() => this.getFields(feature.id, 'feature')}>
                                                            <i className="fa fa-table"></i>
                                                            <span className="hidden-xs gp-text-primary">{feature.name}</span>
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
                <Fields fields={fields} values={values}/>
            </div>
        )
    }

}

