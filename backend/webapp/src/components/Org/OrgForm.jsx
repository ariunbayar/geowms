import React, { Component } from "react"
import {OrgFormTable} from './OrgFormTable'
import {NavLink} from "react-router-dom"
import {service} from "./service"

export class OrgForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            all_users: [{},{},{}],
            orgs: []
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.handleUserDelete=this.handleUserDelete.bind(this)

    }
    componentDidMount(){
        const org_level = this.props.match.params.level

        this.handleGetAll(org_level)
    }
    handleGetAll(org_level){
        service.getAll(org_level).then(({ orgs }) => {
            if (orgs) {
                this.setState({ orgs })
            }
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.level !== prevProps.match.params.level) {
            const org_level = this.props.match.params.level

            this.handleGetAll(org_level)
        }
    }
    handleUserDelete(id){
        const org_level = this.props.match.params.level
        const org_name = this.state.org_name
        service.org_remove(org_level,id).then(({ success }) => {
            if (success) {
                this.handleGetAll(org_level)
            }
        })
    }
    
    render() {
        const {all_users, orgs} = this.state
        const org_level = this.props.match.params.level

        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="text-right">
                        <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/нэмэх/`}>
                            Нэмэх
                        </NavLink>
                    </div>
                    <table className="table example" id="example">
                        <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th scope="col">Байгууллага нэр</th>
                                <th scope="col">Түвшин</th>
                                <th scope="col">устгах</th >
                                <th scope="col">засах</th >
                            </tr>
                        </thead>
                        <tbody>
                            {orgs.map((org) =>
                                <OrgFormTable
                                    org_level={org_level}
                                    org={org}
                                    handleUserDelete={() => this.handleUserDelete(org.id)}
                                    
                                >
                                </OrgFormTable>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    }

}
