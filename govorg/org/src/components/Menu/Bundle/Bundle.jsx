
import React, { Component } from "react"


export default class Bundle extends Component {

    constructor(props) {
        super(props)
        this.state={
            employee:[],
            currentPage:1,
            orgPerPage:20,
        }
    
    }

    render() {
        alert("bundle called")
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="mb-3 mt-3">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                    <th scope="col">Оронзайн суурь өгөгдлийн сан</th>
                                    <th scope="col">харах</th>
                                    <th scope="col">нэмэх</th>
                                    <th scope="col">хасах</th>
                                    <th scope="col">цуцлах</th>
                                    <th scope="col">хянах</th>
                                    <th scope="col">батлах</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>hoho</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
