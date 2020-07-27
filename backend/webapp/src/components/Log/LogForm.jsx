import React, { Component } from "react"
import {LogFormTable} from './LogFormTable'
import LogJson from './log.json'


export class LogForm extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                    <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Гүйлгээний дугаар</th>
                                    <th scope="col">Дүн</th>
                                    <th scope="col">Огноо</th >
                                    <th scope="col">Статус</th>
                                    <th scope="col">Үр дүн</th>
                                    <th scope="col">Зөвшөөрлийн дугаар</th>
                                    <th scope="col">Карт дугаар</th>
                                    <th scope="col">Карт эзэмшигч</th>

                                </tr>
                            </thead>
                            <tbody>
                                {LogJson.map((log, idx) =>
                                    <LogFormTable key = {idx} values={log}></LogFormTable>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )

    }

}
