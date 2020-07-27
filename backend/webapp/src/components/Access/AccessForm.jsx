import React, { Component } from "react"
import {AccessFormTable} from './AccessFormTable'
import AccessJson from './access.json'
import {render} from 'react-dom'
import {Charts} from './Chart'
import {RadarChart} from './Radar'

export class AccessForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор график</h5>
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
                    <div className="row">
                        <h5 className="mb-3">Гүйлгээний хуулга</h5>
                        <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                        <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">IP Хаяг</th>
                                        <th scope="col">Вэб броузер</th>
                                        <th scope="col">Огноо</th >
                                        <th scope="col">Статус</th>
                                        <th scope="col">Хаяг</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AccessJson.map((access, idx) =>
                                        <AccessFormTable key = {idx} values={access}></AccessFormTable>
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
