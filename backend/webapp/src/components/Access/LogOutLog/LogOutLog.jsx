import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {LogOutLogTable} from './LogOutLogTable'


export class LogOutLog extends Component {


    constructor(props) {
        super(props)
        this.state = {
            logout_log_all: [],
        }
        this.handleGetAll=this.handleGetAll.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.logoutAll().then(({ logout_log_all }) => {
            if(logout_log_all){
                this.setState({logout_log_all})
            }
        })

    }

    render() {
        const { logout_log_all } = this.state
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>

                    <h5 className="mb-3">Гарсан мэдээлэл</h5>
                    <div className="row rounded">
                        <div className="col-md-12">
                        <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хэрэглэгчийн нэр</th>
                                        <th scope="col">Хэрэглэгчийн дугаар</th>
                                        <th scope="col">IP Хаяг</th>
                                        <th scope="col">Гарсан огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    {logout_log_all.map((logout, idx) =>
                                        <LogOutLogTable key = {idx} idx = {idx} values={logout}></LogOutLogTable>
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
