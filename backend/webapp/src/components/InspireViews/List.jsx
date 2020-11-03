import React, { Component } from 'react'
import { service } from './service'
import SideBar from './Sidebar'

export class List extends Component {

    constructor(props) {
        super(props)

        this.state = {
            list_all:[],
            fields: [],
            check: '',
            fid: null,
            tid: null,
            id_list: []
        }
        this.getAll = this.getAll.bind(this)
        this.getProperties = this.getProperties.bind(this)
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

    getProperties(fid, tid) {
        this.setState({fid, tid})
        service.getPropertyFields(fid).then(({success ,fields, id_list}) => {
            if(success){
                this.setState({fields, id_list})
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
                                                        <a onClick={() => this.getProperties(feature.id, theme.id)}>
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
                <SideBar fields={this.state.fields} fid={this.state.fid} tid={this.state.tid} id_list={this.state.id_list}/>
            </div>
        )
    }

}