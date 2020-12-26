
import React, { Component } from "react"
import {service} from './service'
import {RevokeRequestTable} from './RevokeRequestTable'

export default class RevokeRequestForm extends Component {

    constructor(props) {
        super(props)
        this.state={
            revoke_requests:[],
            is_loading: false,
        }
        this.getAll = this.getAll.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }
    componentDidMount(){
        this.getAll()
    }

    setLoading() {
        this.setState({ is_loading: true })
    }

    getAll(){
        this.setLoading()
        service
        .getAll()
        .then(({success, revoke_requests}) => {
            console.log(revoke_requests);
           if(success){
               this.setState({revoke_requests, is_loading: false})
            }
        })
    }

    render() {
        const { revoke_requests, is_loading } = this.state
        return (
            <div className="card">
                <div className="card-body">
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
                                    <th></th>
                                    <th scope="col">Төлөв</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    is_loading
                                    ?
                                    <tr>
                                        <td colSpan="7">
                                            <div className="d-flex justify-content-center">
                                                <div className="spinner-border gp-text-primary" role="status"></div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                        revoke_requests.length > 0 ? revoke_requests.map((req, idx) =>
                                            <RevokeRequestTable
                                                key={idx}
                                                idx={idx}
                                                values={req}
                                                getAll={this.getAll}
                                                setLoading={this.setLoading}
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
            </div>
        )
    }
}