import React, { Component } from "react"
import {service} from './service'
import { toSize } from "ol/size"

export class Дэлгэрэнгүй extends Component {


    constructor(props) {

        super(props)

        this.state = {
            items: '',

        }

        this.handleData = this.handleData.bind(this)
    }

    componentDidMount(){

        const schemaname = this.props.match.params.schemaname
        const tablename= this.props.match.params.tablename
        service.getDetail(schemaname, tablename).then(({items}) => {
            this.handleData(items)
        })
    }

    handleData(items){
        this.setState({items})
    }

    render() {
        if (!this.state.items)
            return ''

        const {items} = this.state
        return (
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 mb-4">
                                <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="my-4">
                                    <div className="p-3">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">№</th>
                                                        <th scope="col">field name</th>
                                                        <th scope="col">field type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items === 0 ?
                                                        <tr><td>Хоосон байна </td></tr>:
                                                        items.map((values,index) =>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {values.name}
                                                                </td>
                                                                <td>{values.type}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}