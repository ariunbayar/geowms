import React, { Component } from "react"
import { NavLink } from "react-router-dom"


export class MetaDetail extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: []
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <NavLink className="btn gp-outline-primary" exact to={"/gov/meta/"}>
                                Буцах
                            </NavLink>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <tr>
                                    <th scope="col">org_name</th>
                                    <th scope="col">customer_org</th>
                                    <th scope="col">distributor_org</th>
                                    <th scope="col">owner_org</th>
                                    <th scope="col">keywords</th>
                                    <th scope="col">category</th>
                                    <th scope="col">status</th>
                                    <th scope="col">language</th>
                                    <th scope="col">summary</th>
                                    <th scope="col">title</th>
                                    <th scope="col">uuid</th>
                                    <th scope="col">schema</th>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
