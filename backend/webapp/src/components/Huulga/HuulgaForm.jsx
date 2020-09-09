import React, { Component } from "react"
import {HuulgaFormTable} from './HuulgaFormTable'
import HuulgaJson from './huulga.json'


export class HuulgaForm extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                    <table className="table example" id="example">
                        <thead>
                            <tr>
                                <th scope="col">Гүйлгээний дугаар</th>
                                <th scope="col">Дүн</th>
                                <th scope="col">Огноо</th >
                            </tr>
                        </thead>
                        <tbody>
                            {HuulgaJson.map((huulga, idx) =>
                                <HuulgaFormTable key = {idx} values={huulga}></HuulgaFormTable>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )

    }

}
