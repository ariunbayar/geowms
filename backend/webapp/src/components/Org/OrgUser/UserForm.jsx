import React, { Component } from "react"
import {UserFormTable} from './UserFormTable'
import {service} from '../service'
import {NavLink} from "react-router-dom"
export class UserForm extends Component {


    constructor(props) {

        super(props)

        this.state = {
            govorg_list: [{},{}],

        }
        this.handleGovorgDelete = this.handleGovorgDelete.bind(this)
    }

    componentDidMount() {
    }

    handleGovorgDelete(id) {
        alert(id)

    }
    render() {
        const {govorg_list} = this.state
        const id=this.props.values
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="container">
                <div className="row">
                    <div  className="container my-4">
                        <div className="col-md-12">
                            <div className="text-left">
                                <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                    <a className="btn btn-outline-primary">
                                        <i className="fa fa-angle-double-left"></i> Буцах
                                    </a>
                                </NavLink>
                            </div>
                            <div className="text-right">
                                <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/нэмэх/`}>
                                    Нэмэх
                                </NavLink>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Ажилтны нэр </th>
                                        <th scope="col">Албан тушаал</th>
                                        <th scope="col">Үүссэн огноо</th>
                                        <th scope="col">Зассан огноо</th>
                                        <th scope="col">Устгах</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {govorg_list.map((govorg, idx) =>
                                        <UserFormTable 
                                            org_level={org_level}
                                            org_id={org_id}
                                            key = {idx} 
                                            values={govorg} 
                                            handleGovorgDelete={() => this.handleGovorgDelete(2)}
                                        >
                                        </UserFormTable>
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
