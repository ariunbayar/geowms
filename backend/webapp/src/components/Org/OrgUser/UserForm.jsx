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
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/:level/:id/нэмэх/`}>
                                Нэмэх
                            </NavLink>
                            <NavLink className="btn gp-bg-primary" to={`back/байгууллага/түвшин/${id}/${1}/Дэлгэрэнгүй/`}>
                                Дэлгэрэнгүй
                            </NavLink>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Байгууллагын нэр </th>
                                    <th scope="col">Хэн ажиллах</th>
                                    <th scope="col">Устгах icon</th>
                                    <th scope="col">Засах icon</th>
                                    <th scope="col">дэлгэрэнгүйг харах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {govorg_list.map((govorg, idx) =>
                                    <UserFormTable 
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
        )
    }
}
