import React, { Component } from "react"
import {OrgFormTable} from './OrgFormTable'
import {NavLink} from "react-router-dom"


export class OrgForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            all_users: [{},{},{}],
        }
        this.handleUserDelete=this.handleUserDelete.bind(this)

    }
    componentDidMount(){

    }
    handleUserDelete(id){
        alert(id)
    }

    render() {
        const {all_users} = this.state
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
                                <th scope="col">Хэрэглэгчийн нэр</th>
                                <th scope="col">Админ болсон огноо</th>
                                <th scope="col">Админ эрх олгосон хэрэглэгч</th >
                                <th scope="col">Харьяат байгууллага</th >
                                <th scope="col">устгах</th >
                            </tr>
                        </thead>
                        <tbody>
                            {all_users.map((users, idx) =>
                                <OrgFormTable 
                                    key = {idx} 
                                    org_level={org_level}
                                    org_id={idx}
                                    values={users} 
                                    handleUserDelete={() => this.handleUserDelete(2)}
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
