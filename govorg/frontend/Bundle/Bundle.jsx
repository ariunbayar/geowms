
import React, { Component } from "react"
import { service } from "./service"
import {Item}  from "./Items"

export default class Bundle extends Component {

    constructor(props) {
        super(props)
        this.state={
            employee:[],
            org_roles: [],
            list:[],
            currentPage:1,
            orgPerPage:20,
        }

    }
    componentDidMount(){
        this.handlegetAll()
    }

    handlegetAll(){
        service.roles().then(({org_roles}) => {
            if(org_roles){
                this.setState({
                    org_roles
                })
            }
        })
    }

    handleChange(idx, org_role_updated) {
        this.setState({
            org_roles: this.state.org_roles.map((org_role, _idx) =>
                idx == _idx ? org_role_updated : org_role
            ),
        })
    }


    render() {
        return (
            <div className='card'>
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
                        {this.state.org_roles.map((org_role, idx) =>
                            <Item key={idx} org_role={org_role} />
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
