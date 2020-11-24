import React, { Component } from "react"
import ModalAlert from '../components/helpers/ModalAlert'
import { NavLink } from "react-router-dom"
import Rows from './Rows'
import {service} from './Role/service'

export class List extends Component {
    constructor(props) {
        super(props)
            this.state = {
            roles: [],
            alert: false,
            perms: props.perms,
            modal_alert_status: "closed",
            timer: null,
            is_loading: false,
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.getRolesList = this.getRolesList.bind(this)
    }

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({ modal_alert_status: "closed" })
        this.paginate(1, "")
    }

    componentDidMount(){
        this.getRolesList()
    }

    getRolesList() {
        this.setState({ is_loading: false })
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if(success) {
                    this.setState({ is_loading: true, roles })
                }
            })
    }

    handleRemove(id) {
        service
            .deleteRole(id)
            .then(({ success }) => {
                if (success) {
                    console.log("ustgasan", id)
                    this.getRolesList()
                }
            })
    }

    render() {
        const { roles, is_loading } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    {
                        !is_loading
                        ?
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border gp-text-primary" role="status"></div>
                            </div>
                        :
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="text-right">
                                        <NavLink
                                            className="btn gp-btn-primary waves-effect waves-light m-1"
                                            to={`/gov/perm/role/add/`}>
                                            Нэмэх
                                        </NavLink>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table ">
                                            <thead>
                                                <tr>
                                                    <th scope="col">№</th>
                                                    <th scope="col">title</th>
                                                    <th scope="col">Засах</th>
                                                    <th scope="col">Устгах</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    roles.map((p, idx) =>
                                                        <Rows key={idx}
                                                            index={idx + 1}
                                                            values={p}
                                                            handleRemove={() => this.handleRemove(p.role_id)}
                                                        />
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <ModalAlert
                                        modalAction={() => this.modalClose()}
                                        status={this.state.modal_alert_status}
                                        title="Амжилттай устгалаа"
                                        model_type_icon="success"
                                    />
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}
