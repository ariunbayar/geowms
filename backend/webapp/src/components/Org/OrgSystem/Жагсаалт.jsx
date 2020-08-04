import React, { Component } from "react"

import {service} from './service'
import GovorgForm from './GovorgForm'
import Govorg from './Govorg'
import {NavLink} from "react-router-dom"


export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
        }

        this.state = {
            govorg_list: [],
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    componentDidMount() {
        const org_level = this.props.match.params.level
        const id = this.props.match.params.id
        this.handleListUpdated(org_level)
    }

    handleListUpdated(org_level, org_id) {

        service.getAll().then(({govorg_list}) => {
            this.setState({govorg_list})
        })

    }
    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.handleListUpdated()
        })

    }
    render() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div  className="container my-4">
                <div className="row">

                    <div className="col-md-12">

                        {!this.state.is_form_open &&
                            <>
                                <div className="text-left">
                                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                        <a className="btn btn-outline-primary">
                                            <i className="fa fa-angle-double-left"></i> Буцах
                                        </a>
                                    </NavLink>
                                </div>

                                <div className="text-right">
                                    <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/үүсгэх/`}>
                                        Нэмэх
                                    </NavLink>
                                </div>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"> # </th>
                                            <th scope="col"> Системүүдийн нэр</th>
                                            <th scope="col"> Токен </th>
                                            <th scope="col"> Үүсгэсэн огноо </th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.govorg_list.map((values) =>
                                            <Govorg
                                                org_level={org_level}
                                                org_id={org_id}
                                                key={values.id}
                                                values={values}
                                                handleRemove={() => this.handleRemove(values.id)}
                                                handleEdit={() => this.handleEdit(values)}
                                               />
                                        )}
                                    </tbody>
                                </table>
                            </>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
