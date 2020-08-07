import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {LoginLogTable} from './LoginLogTable'


export class LoginLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login_log_all: [],
        }
        this.handleGetAll=this.handleGetAll.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.loginAll().then(({ login_log_all }) => {
            if(login_log_all){
                this.setState({login_log_all})
            }
        })

    }

    render() {
        const { login_log_all } = this.state
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded container">
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

                    <h5 className="mb-3">Нэвтэрч орсон мэдээлэл</h5>
                    <div className="row rounded">
                        <div className="col-md-12">
                        <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хэрэглэгчийн нэр</th>
                                        <th scope="col">Хэрэглэгчийн дугаар</th>
                                        <th scope="col">IP Хаяг</th>
                                        <th scope="col">Нэвтэрсэн огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    {login_log_all.map((login, idx) =>
                                        <LoginLogTable key = {idx} idx = {idx} values={login}></LoginLogTable>
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
