import React, { Component } from "react"
import {AddUserFormTable} from './AddUserFormTable'
import {NavLink} from "react-router-dom"


export class AddUserForm extends Component {

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
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                    <div className="text-right">
                        <NavLink className="btn gp-bg-primary" to={`/back/user/govorg/level/4/нэмэх/`}>
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
                                <AddUserFormTable 
                                    key = {idx} 
                                    values={users} 
                                    handleUserDelete={() => this.handleUserDelete(2)}
                                >
                                </AddUserFormTable>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )

    }

}
