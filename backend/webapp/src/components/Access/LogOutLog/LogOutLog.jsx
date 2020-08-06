import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {LogOutLogTable} from './LogOutLogTable'


export class LogOutLog extends Component {


    constructor(props) {
        super(props)
        this.state = {
            user_log: [],
        }
        this.handleGetAll=this.handleGetAll.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.getAll().then(({ user_log }) => {
            if(user_log){
                this.setState({user_log})
            }
        })

    }

    render() {
        const { user_log } = this.state
        return (
            <div className="main-content">
                logout heseg
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
                                        <th scope="col">Хэрэглэгчийн нэр</th>
                                        <th scope="col">IP Хаяг</th>
                                        <th scope="col">Вэб броузер</th>
                                        <th scope="col">Вэб броузер version</th>
                                        <th scope="col">device name</th>
                                        <th scope="col">Огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    {user_log.map((users, idx) =>
                                        <LogOutLogTable key = {idx} idx = {idx} values={users}></LogOutLogTable>
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
