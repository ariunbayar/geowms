import React, { Component } from 'react'
import { service } from './service'



export class List extends Component {

    constructor(props) {
        super(props)

        this.state={
            list_all:[]
        }
        this.getAll = this.getAll.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        service.getall().then(({success, data}) => {
            if(success){
                this.setState({
                    list_all:data
                })
            }
        })
    }
    render() {
        const {list_all} = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <ul>
                    {list_all.map((theme, idx) =>
                        <li key={idx}>
                            {theme.id} : {theme.name}
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
        )
    }

}

