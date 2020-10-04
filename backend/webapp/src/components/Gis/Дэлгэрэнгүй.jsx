import React, { Component } from "react"
import {service} from './service'
import Data from './Data'
import { toSize } from "ol/size"

export class Дэлгэрэнгүй extends Component {


    constructor(props) {

        super(props)

        this.state = {
            items: '',
            data: ''

        }

        this.handleData = this.handleData.bind(this)
    }

    componentDidMount(){

        const schemaname = this.props.match.params.schemaname
        const tablename= this.props.match.params.tablename
        service.getDetail(schemaname, tablename).then(({items, data}) => {
            this.handleData(items, data)
        })
    }

    handleData(items, data){
        this.setState({items, data})
    }

    render() {
        if (!this.state.items)
            return ''

        const {items, data} = this.state
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
                        <div className="row">
                            <div className="col-md-12">
                                <div className="my-4">
                                    <div className="p-3">
                                        <div className="table-responsive">
                                            <p>Дурын 10 өгөгдөл:</p>
                                             <table className="table">
                                                <thead>
                                                    <tr>
                                                        {data === 0 ?
                                                            <tr><td>Хоосон байна </td></tr>:
                                                            Object.keys(data[0]).map((key) => {
                                                                return(
                                                                    <th key={key} scope="col">{key} </th>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data === 0 ?
                                                        <tr><td>Хоосон байна </td></tr>:
                                                        data.map((values,index) =>
                                                            <Data
                                                                key={index}
                                                                values={values}
                                                            />
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
