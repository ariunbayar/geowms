
import React, { Component } from "react"
import {service} from './service'
import {ChangeRequestTable} from './changeRequestTable'


export default class ChangeRequestForm extends Component {

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
        .then(({ success ,org_request }) => {
           if(success){
               this.setState({org_request})
            }
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
                                    <th scope="col">Тушаалын дугаар</th >
                                    <th scope="col">Тушаал гарсан огноо</th >
                                    <th scope="col">Огноо</th >
                                    <th>Төлөв</th>
                                    <th>Өөрчлөлт</th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    org_request.length > 0 ? org_request.map((req, idx) =>
                                        <ChangeRequestTable
                                            key={idx}
                                            idx={idx}
                                            values = {req}
                                            getAll = {this.getAll}
                                        />
                                    )
                                    :<tr>
                                    <td className="text-justify">Өөрчлөлт байхгүй байна</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
