import React, { Component } from "react"
import "./style.css"
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
                                    <th scope="col"> ID </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">Мэйл</th>
                                    <th scope="col">Эрх</th>
                                    <th scope="col"></th>
                                    <th scope="col">Баталгаажилт</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.user_list.map((values, index) =>
                                    <User
                                        index={index +1 }
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
