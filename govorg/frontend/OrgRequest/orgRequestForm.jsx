
import React, { Component } from "react"
import {service} from './service'
import {OrgRequestTable} from './orgRequestTable'


export default class OrgRequestForm extends Component {

    constructor(props) {
        super(props)
        this.state={
            org_request:[]
        }
        this.getAll = this.getAll.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        service
        .getAll()
        .then(({ org_request }) => {
            this.setState({ org_request})
        })
    }

    render() {
        const org_request = this.state.org_request
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Орон зайн өгөгдөл</th>
                                    <th scope="col">Байгууллага / мэргэжилтэн</th>
                                    <th scope="col">Огноо</th >
                                    <th></th>
                                    <th>Төлөв</th>
                                    <th>Төлвийн төрөл</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    org_request.length > 0 ? org_request.map((req, idx) =>
                                        <OrgRequestTable
                                            key={idx}
                                            idx={idx}
                                            values = {req}
                                        />
                                    )
                                    :null 
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
