import React, { Component } from "react"
import {service} from './service'
import Bundle from './Bundle'
import {NavLink} from "react-router-dom"

export class BundleList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            bundle_list: [],
        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleMove = this.handleMove.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({bundle_list}) => {
            this.setState({bundle_list})
        })

    }

    handleSaveSuccess() {
        this.handleListUpdated()
    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.handleSaveSuccess()
        })
    }

    handleMove(event, id, direction) {
        event.preventDefault()
        service.move(id, direction).then(({bundle_list, success}) => {
            if (success) this.setState({bundle_list})
        })
    }

    render() {
        return (
            <div  className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/back/үүсгэх/`}>
                                Нэмэх
                            </NavLink>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> Сангийн нэр </th>
                                    <th scope="col"> WMS сервис </th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.bundle_list.map((values) =>
                                    <Bundle
                                        key={values.id}
                                        values={values}
                                        handleRemove={() => this.handleRemove(values.id)}
                                        handleMove={this.handleMove}
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
