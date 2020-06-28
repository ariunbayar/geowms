import React, { Component } from "react"

import {service} from './service'
import User from './User'

export class UserPage extends Component {


    constructor(props) {

        super(props)

        this.state = {
            user_list: [],
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({user_list}) => {
            this.setState({user_list})
        })

    }

    render() {
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> Овог </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">Хүйс</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.user_list.map((values) =>
                                    <User
                                        key={values.id}
                                        values={values}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
