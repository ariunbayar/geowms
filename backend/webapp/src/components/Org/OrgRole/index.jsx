import React, { Component } from "react"
import {service} from '../service'
import {NavLink} from "react-router-dom"

import {Item} from './Item'


export class OrgRole extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_roles: [],
            list:[],
            changedName:''
        }
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        const {level, id} = this.props.match.params
        service.roles(level, id).then(({org_roles}) => {
            this.setState({org_roles})
        })
    }

    handleOnChange(e,id){
        const listArray=this.state.list

        this.setState({
            [e.target.name]: e.target.checked,
            bundleId:id,
            changedName:e.target.name
        })
    }

    handleSave(){
        const {level, id} = this.props.match.params
        service.rolesSave(level, id, this.state.org_roles).then(({success}) => {
            if (success) {
                this.handleListUpdated()
                
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
        const org_level = this.props.match.params.level

        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-left">
                            <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                <p className="btn btn-outline-primary">
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </p>
                            </NavLink>
                        </div>
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
                                    {this.state.org_roles.map((org_role, idx) =>
                                        <Item key={idx} org_role={org_role} handleChange={org_role => this.handleChange(idx, org_role)}/>
                                    )}
                                </tbody>
                            </table>
                             <button className="btn gp-bg-primary" onClick={this.handleSave}>Хадгалах</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
