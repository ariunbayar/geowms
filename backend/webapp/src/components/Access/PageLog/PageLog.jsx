import React, { Component } from "react"
import {PageLogTable} from './PageLogTable'
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"

export class PageLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            page_logs: [],
        }
        this.handleGetAll=this.handleGetAll.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.pageAll().then(({ page_logs }) => {
            if(page_logs){
                this.setState({page_logs})
            }
        })

    }

    render() {
        const { page_logs } = this.state
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын төхөөрөмжийн тоогоор</h5>
                            <RadarChart></RadarChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>

                    <h5 className="mb-3">Нэвтэрч орсон мэдээлэл</h5>
                    <div className="row rounded">
                        <div className="col-md-12">
                        <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хаяг</th>
                                        <th scope="col">Metod</th>
                                        <th scope="col">IP Хаяг</th >
                                        <th scope="col">Хэрэглэгчийн дугаар</th >
                                        <th scope="col">Огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    {page_logs.map((page, idx) =>
                                        <PageLogTable key = {idx} idx = {idx} values={page}></PageLogTable>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}
